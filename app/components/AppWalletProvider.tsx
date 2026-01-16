"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnifiedWalletProvider } from "@jup-ag/wallet-adapter"; // 👈 これが主役
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// スタイルシートの読み込み（重要）
import "@solana/wallet-adapter-react-ui/styles.css";

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const network = WalletAdapterNetwork.Mainnet;
  // RPCエンドポイント（既存のままでOK）
  const endpoint = "https://mainnet.helius-rpc.com/?api-key=22c6e5c7-d777-4a22-aa97-f4e328f34c2d";

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {/* 👇 ここからJupiterのプロバイダーに変更 */}
        <UnifiedWalletProvider
          wallets={wallets}
          config={{
            autoConnect: true,
            env: 'mainnet-beta',
            metadata: {
              name: 'WAVIS Protocol',
              description: 'Solana Rent Recovery Tool',
              url: 'https://wavis.xyz',
              iconUrls: ['https://wavis.xyz/favicon.ico'], // アイコン
            },
            theme: 'dark', // ダークモード強制
          }}
        >
          {children}
        </UnifiedWalletProvider>
        {/* 👆 ここまで */}
      </WalletProvider>
    </ConnectionProvider>
  );
}