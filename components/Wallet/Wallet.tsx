import { useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useCallback, useState } from 'react';
import { Button } from '../Button/Button';
import { coinbaseWallet, genericWallet, metamaskWallet } from './connectors';
import styles from './Wallet.module.css';

const ETH_AMOUNT_FOR_DEMO = 1000000000000000;

export const Wallet = () => {
  const { active, account, activate, chainId, deactivate, library } =
    useWeb3React();
  const [showChainId, setShowChainId] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);

  const connect = useCallback(
    async (connector: AbstractConnector) => {
      try {
        await activate(connector);
      } catch (error) {
        console.log(error);
      }
    },
    [activate],
  );

  const disconnect = useCallback(async () => {
    try {
      await deactivate();
      setShowChainId(false);
      setAccountBalance(0);
    } catch (error) {
      console.log(error);
    }
  }, [deactivate]);

  // TODO: show a loading state
  const getBalance = () => {
    library.eth
      .getBalance(account)
      .then((balance: number) => setAccountBalance(balance));
  };

  const sendTransaction = () => {
    library.eth.sendTransaction({
      from: account,
      to: account,
      value: ETH_AMOUNT_FOR_DEMO,
    });
  };

  if (active) {
    return (
      <div className={styles.group}>
        <div className={styles.actionAndData}>
          <Button onClick={() => setShowChainId(true)}>Get chain ID</Button>
          {showChainId && chainId ? <div>Chain ID: {chainId}</div> : null}
        </div>
        <div className={styles.actionAndData}>
          <Button onClick={getBalance}>Get balance</Button>
          {accountBalance ? <div>Balance: {accountBalance}</div> : null}
        </div>
        <div>
          <Button onClick={sendTransaction}>Send transaction</Button>
        </div>
        <div>
          <Button onClick={disconnect}>Disconnect</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.group}>
      <div>
        <Button onClick={() => connect(metamaskWallet)}>
          Connect to MetaMask
        </Button>
      </div>
      <div>
        <Button onClick={() => connect(coinbaseWallet)}>
          Connect to Coinbase
        </Button>
      </div>
      <div>
        <Button onClick={() => connect(genericWallet)}>
          Connect to another wallet
        </Button>
      </div>
    </div>
  );
};
