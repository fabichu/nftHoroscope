import "./App.css";
import { useState, useEffect } from "react";
import { Contract, providers } from 'ethers';
import NFT from './abi/horoscope.json';

function App() {

  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
    .then(handleAccounts)
    .catch(console.error);
  }

  const checkConnection = () => {
    window.ethereum.request({ method: 'eth_accounts' })
    .then(handleAccounts)
    .catch(console.error);
  }

  const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  }

  window.ethereum.on('accountsChanged', checkConnection);

  useEffect(() => {
    checkConnection();
  });

  if (!window.ethereum) {
    return (
      <div className="App">
        <h1>PLEASE INSTALL METAMASK</h1>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="App">
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>MINT YOUR ZODIAC SIGN 😎</h1>
      <p>Connected as: <b className='bold'>{account}</b></p>
    </div>
  );
}

export default App;
