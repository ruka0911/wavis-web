"use client";

import { useState, useEffect } from "react"; // 👈 追加
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import Dashboard from "@/app/components/Dashboard"; 
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useTranslations } from 'next-intl'; 
import { Twitter, MessageCircleQuestion, Github } from "lucide-react";

const GOOGLE_FORM_URL = "https://x.com/WAVIS_SOL"; 

export default function Home() {
  const { connected } = useWallet();
  const t = useTranslations('HomePage'); 
  const tFooter = useTranslations('Footer');

  // 👇 ハイドレーション・エラー対策: マウントされたかどうかの判定フラグ
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // 👆 ここまで

  return (
    <main className="min-h-screen bg-[#0B1021] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* 背景装飾 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F97316] opacity-10 blur-[120px] rounded-full"></div>
      </div>

      {/* ヘッダーエリア */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <Image src="/wavis-hero.png" alt="Logo" width={32} height={32} className="object-contain" />
          <span className="font-bold text-xl tracking-tight">WAVIS</span>
          <LanguageSwitcher />
        </div>
        
        {/* 👇 対策: マウントされるまでボタンを表示しない（これでエラーが消えます） */}
        {mounted && (
           <WalletMultiButton style={{ backgroundColor: connected ? "#1E293B" : "#F97316", height: "40px", fontSize: "14px" }} />
        )}
      </div>

      {/* コンテンツエリア */}
      <div className="relative z-10 w-full flex flex-col items-center pt-20">
        
        {/* 👇 対策: ここも念の為 mounted チェックを入れる */}
        {mounted && connected ? (
          <Dashboard />
        ) : (
          <div className="text-center max-w-2xl space-y-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative w-40 h-40 mb-4 animate-pulse">
                <Image 
                  src="/wavis-hero.png" 
                  alt="WAVIS Logo" 
                  width={160} 
                  height={160} 
                  className="object-contain drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                />
            </div>

            <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-[#F97316] via-[#EAB308] to-[#F97316] text-transparent bg-clip-text bg-300% animate-gradient">
              {t('title')}
            </h1>
            
            <p className="text-slate-400 text-xl font-light" dangerouslySetInnerHTML={{ __html: t.raw('subtitle') }} />

            <div className="pt-8">
               <p className="text-sm text-[#F97316] font-bold mb-2 animate-bounce">👇 {t('connectBtn')}</p>
               <div className="scale-125">
                 {/* 👇 対策: ボタン部分 */}
                 {mounted && (
                   <WalletMultiButton style={{ backgroundColor: "#F97316", fontWeight: "800", borderRadius: "8px" }} />
                 )}
               </div>
            </div>
          </div>
        )}

      </div>
      
      {/* フッターエリア */}
      <footer className="fixed bottom-0 w-full p-6 pb-32 md:pb-6 bg-gradient-to-t from-[#0B1021] to-transparent z-30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-slate-500 font-mono">
          
          <span className="opacity-70 order-3 md:order-1">
             {t('footer')}
          </span>

          <span className="hidden md:inline text-slate-800 order-1 md:order-2">|</span>

          <div className="flex items-center gap-6 order-1 md:order-3">
            <a 
              href="https://x.com/WAVIS_SOL" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#F97316] transition-colors"
            >
              <Twitter size={14} />
              {tFooter('official')}
            </a>

            <a 
              href="https://x.com/NFT_Coll"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {tFooter('developer')}
            </a>

            <a 
              href="https://github.com/ruka0911/wavis-web" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Github size={14} />
              <span>GitHub</span>
            </a>
          </div>

          <span className="hidden md:inline text-slate-800 order-2 md:order-4">|</span>

          <a 
              href={GOOGLE_FORM_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors order-2 md:order-5"
            >
              <MessageCircleQuestion size={14} />
              {tFooter('feedback')}
            </a>

        </div>
      </footer>

    </main>
  );
}