import "./App.css";
import { useState, useEffect } from "react";
import { Contract, providers } from 'ethers';
import NFT from './abi/horoscope.json';
import signs from './zodiacSigns.json';

function App() {

  const rynkebyId = "4";
  const [account, setAccount] = useState('');
  const [date, setDate] = useState("1992-08-31");
  const [nftBackground, setNftBackground] = useState("#8789C0");
  const [zodiacSign, setZodiacSign] = useState(null);
  const [zodiacIcon, setZodiacIcon] = useState(null);
  const [NFTContract, setNFTContract] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const NFT_CONTRACT_ADDRESS = '0x463C43d1747cD7d8e1d86B0bB23e05e8397dfd47';

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

  const getNetworkId = async () => {
    setNetworkId(await window.ethereum.networkVersion);
  }

  window.ethereum.on('networkChanged', getNetworkId);
  window.ethereum.on('accountsChanged', checkConnection);

  useEffect(() => {
    checkConnection();
    getNetworkId();
  });

  function handleDateInput({ target }) {
    setDate(target.value);
  }

  function handleColorInput({ target }) {
    setNftBackground(target.value);
  }

  useEffect(() => {
    calculateZodiacSign(date);
  }, [date]);

  function calculateZodiacSign(date) {
    let dateObject = new Date(date);
    let day = dateObject.getDate();
    let month = dateObject.getMonth();

    if (day >= signs[month].daySplit) {
      setZodiacSign(signs[month].sign);
      setZodiacIcon(signs[month].icon);
    }else {
      if (month === 0) {
        setZodiacSign(signs[11].sign);
        setZodiacIcon(signs[11].icon);
      }else {
        setZodiacSign(signs[month - 1].sign);
        setZodiacIcon(signs[month - 1].icon);
      }
    }
  }

  useEffect(() => {
    function initNFTContract() {
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(NFT_CONTRACT_ADDRESS, NFT.abi, signer));
    }
    initNFTContract();
  }, [account]);

  const mintNft = async () => {
    try {
      let nftText = zodiacSign + " " + zodiacIcon;
      await NFTContract.mintNFT(account, nftText, nftBackground);
    } catch (e) {
      console.error(e);
    }
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
      {zodiacSign ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMinYMin meet"
            viewBox="0 0 300 300"
            width="400px"
            height="400px"
          >
            <style>{`.base { fill: white; font-family: Arial; font-size: 24px;`}</style>
            <rect width="100%" height="100%" fill={nftBackground} />
            <text
              x="50%"
              y="50%"
              className="base"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              {zodiacSign + " " + zodiacIcon}
            </text>
          </svg>
      ) : null}
      {networkId === rynkebyId ? (
        <button className='mintButton' onClick={mintNft}>
        Mint NFT 🎉
        </button>
      ) : 
        <button className='errorButton'>
        Please switch to Rynkeby Testnet
        </button>
      }
    </div>
  );
}

export default App;
