import React, { useRef, useEffect } from "react";
import {
  createOkxSwapWidget,
  ProviderType,
  OkxSwapWidgetProps,
  OkxEvents,
  OkxEventHandler,
  IWidgetConfig,
  TradeType,
  THEME,
} from "@okxweb3/dex-widget";

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

const WidgetPage: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!widgetRef.current) return;

    const params: OkxSwapWidgetProps["params"] = {
      appCode: "YOUR_APP_CODE",
      width: 450,
      height: 400,
      providerType: ProviderType.EVM,
      tradeType: TradeType.AUTO,
      // chainIds: ["10", "8453", "1", "137", "59144", "5000"],
      theme: THEME.LIGHT,
      lang: "en_us",
      tokenPair: {
        fromChain: 5000, //Mantle
        toChain: 5000, // Mantle
        fromToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // MNT
        toToken: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9", // USDC
      },
      bridgeTokenPair: {
        fromChain: 8453, // BASE
        toChain: 5000, // Mantle
        fromToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH
        toToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // MNT
      },
      feeConfig: {
        5000: {
          feePercent: 1,
          referrerAddress: "0x9163756d2a83a334de2cc0c3aa1df9a5fc21369d", // Change this to your referrer address
        },
        8453: {
          feePercent: 1,
          referrerAddress: "0x9163756d2a83a334de2cc0c3aa1df9a5fc21369d", // Change this to your referrer address
        },
      },
    };
    const provider = window.ethereum;

    const listeners: IWidgetConfig["listeners"] = [
      {
        event: OkxEvents.ON_CONNECT_WALLET,
        handler: (() => {
          provider?.enable();
        }) as OkxEventHandler<OkxEvents.ON_CONNECT_WALLET>,
      },
    ];

    const widgetProps: IWidgetConfig = {
      params,
      provider,
      listeners,
    };

    const instance = createOkxSwapWidget(widgetRef.current, widgetProps);

    return () => {
      instance.destroy();
    };
  }, []);

  return (
    <div className="widget-page">
      <h2>OKX DEX Widget</h2>
      <div ref={widgetRef} />
    </div>
  );
};

export default WidgetPage;
