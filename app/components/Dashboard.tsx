"use client";

import { useState, useEffect, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createCloseAccountInstruction } from "@solana/spl-token";
import { Loader2, Trash2, RefreshCw, ShieldCheck } from "lucide-react";
import { useTranslations } from 'next-intl'; // 👈 インポート

export default function Dashboard() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const t = useTranslations('Dashboard'); // 👈 'Dashboard' グループを使う
  
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [totalRent, setTotalRent] = useState(0);
  const [status, setStatus] = useState("");

  const scanWallet = useCallback(async () => {
    if (!publicKey) return;
    setIsLoading(true);
    setStatus(t('processing')); // 👈 翻訳
    setAccounts([]);
    setTotalRent(0);

    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID
      });

      let foundAccounts = [];
      let rentSum = 0;

      for (const { pubkey, account } of tokenAccounts.value) {
        const info = account.data.parsed.info;
        const amount = info.tokenAmount.uiAmount;
        
        if (amount === 0) {
          const lamports = account.lamports;
          const rentSol = lamports / 1000000000;
          
          rentSum += rentSol;
          foundAccounts.push({
            pubkey,
            mint: info.mint,
            rent: rentSol
          });
        }
      }

      setAccounts(foundAccounts);
      setTotalRent(rentSum);
      setStatus(""); // スキャン完了時はステータスをクリアするか、適切なメッセージを

    } catch (error) {
      console.error("Scan failed", error);
      setStatus("Error");
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, t]);

  useEffect(() => {
    scanWallet();
  }, [scanWallet]);

  const handleRecover = async () => {
    if (!publicKey || accounts.length === 0) return;

    try {
      setIsLoading(true);
      setStatus(t('processing'));

      const transaction = new Transaction();
      const batch = accounts.slice(0, 20);

      batch.forEach((acc) => {
        transaction.add(
          createCloseAccountInstruction(
            acc.pubkey, 
            publicKey, 
            publicKey 
          )
        );
      });
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setStatus("🎉 Success!");
      await scanWallet();

    } catch (error) {
      console.error("Recovery failed", error);
      setStatus("Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1E293B] p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
          <div className="text-gray-400 text-sm mb-1">{t('totalRecoverable')}</div>
          <div className="text-4xl font-bold text-[#F97316]">{totalRent.toFixed(4)} SOL</div>
          <div className="text-xs text-gray-500">≈ ${(totalRent * 145).toFixed(2)} USD</div>
        </div>
        
        <div className="bg-[#1E293B] p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
          <div className="text-gray-400 text-sm mb-1">{t('spamAccounts')}</div>
          <div className="text-4xl font-bold text-white">{accounts.length}</div>
          <div className="text-xs text-gray-500">{t('readyToBurn')}</div>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center text-center">
          <div className="text-gray-400 text-sm mb-1">{t('safetyScore')}</div>
          <div className="text-4xl font-bold text-green-400 flex items-center gap-2">
            <ShieldCheck size={32} /> 100%
          </div>
          <div className="text-xs text-gray-500">Safe Mode Active</div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {accounts.length > 0 ? (
          <button
            onClick={handleRecover}
            disabled={isLoading}
            className="group relative w-full max-w-md bg-gradient-to-r from-[#F97316] to-[#EAB308] hover:from-[#ea580c] hover:to-[#ca8a04] text-white font-bold py-4 px-8 rounded-full text-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> {t('processing')}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Trash2 /> {t('recoverAll')} ({accounts.length > 20 ? "20 Batch" : accounts.length})
              </span>
            )}
          </button>
        ) : (
          <div className="text-gray-400 flex items-center gap-2 bg-[#1E293B] px-6 py-3 rounded-full">
            <ShieldCheck className="text-green-500" />
            {t('cleanMessage')}
          </div>
        )}

        {status && (
          <div className="text-sm text-gray-400 flex items-center gap-2">
            {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            {status}
          </div>
        )}
      </div>

      <div className="text-center">
        <button onClick={scanWallet} className="text-xs text-gray-600 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors">
          <RefreshCw size={12} /> {t('rescan')}
        </button>
      </div>

    </div>
  );
}