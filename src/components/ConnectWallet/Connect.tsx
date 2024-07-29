"use client";

import { useUtils } from "@telegram-apps/sdk-react";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { List, Title } from "@telegram-apps/telegram-ui";

import "./styles.css";

export const ConnectWallet = () => {
  const wallet = useTonWallet();

  if (!wallet) {
    return <TonConnectButton className="ton-connect-page__button" />;
  }

  const {
    account: { chain, publicKey, address },
    device: { appName, appVersion, maxProtocolVersion, platform, features },
  } = wallet;

  return (
    <List>
      {"imageUrl" in wallet && (
        <>
          <Title level="3">{wallet.name}</Title>
          <TonConnectButton className="ton-connect-page__button-connected" />
        </>
      )}
    </List>
  );
};
