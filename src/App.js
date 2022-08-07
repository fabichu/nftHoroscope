import "./App.css";
import { useState, useEffect } from "react";
import { Contract, providers } from 'ethers';
import NFT from './abi/horoscope.json';

function App() {

  const [account, setAccount] = useState('');
  const [date, setDate] = useState("1992-08-31");
  const [nftBackground, setNftBackground] = useState("#8789C0");

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

  function handleDateInput({ target }) {
    setDate(target.value);
  }

  function handleColorInput({ target }) {
    setNftBackground(target.value);
  }

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
      <p>You can see yout minted NFTs
        <a
          className='bold'
          href={"https://testnets.opensea.io/" + account} 
          target="_blank"
          rel='noreferrer'
        > HERE 👈</a>
      </p>
      <div className='selectors'>
        <input onChange={handleDateInput} value={date} type="date" id="dob" />

        <div className='colorSelector'>
          <input id="colorPicker" type="color" value={nftBackground} onChange={handleColorInput} />
          <label htmlFor="colorPicker">{" "}Select the background!</label>
        </div>
      </div>
    </div>
  );
}

export default App;
