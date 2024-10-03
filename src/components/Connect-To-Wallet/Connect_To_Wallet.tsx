import '@fortawesome/fontawesome-free/css/all.min.css';
import { motion } from "framer-motion"
import { useState } from 'react';
import Web3 from 'web3';

interface AccountInfo {
  address: string;
  balance: string;
}

function ConnectToWallet() {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const connectToWallet = async (): Promise<void> => {
    if (window.ethereum?.isMetaMask) {
      try {
        const web3 = new Web3(window.ethereum);
        const accountsList = await web3.eth.requestAccounts();
        console.log('Connected account:', accountsList);

        const accountDetails: AccountInfo[] = await Promise.all(
          accountsList.map(async (account) => {
            const balanceInWei = await web3.eth.getBalance(account);
            const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether');
            return { address: account, balance: balanceInEth };
          })
        );
        setAccounts(accountDetails);
      } catch (error) {
        console.error('Error connecting to wallet or fetching balance', error);
      }
    } else {
      alert('MetaMask extension is not installed.');
    }
  };

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000); 
    } catch (error) {
      console.error('Failed to copy the address', error);
    }
  };

  return (
    <div className='flex items-center'>
      <motion.div
        className='w-[580px] h-screen'
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <img className='w-full h-[600px]' src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=035" alt="" />
      </motion.div>

      <div>
        {accounts.length > 0 ? (
          accounts.map((account, index) => (
            <div key={index} className='bg-zinc-900 w-full py-5 px-16 rounded-2xl mb-5'>
              <h1>Account Details: {index + 1}</h1>
              <div>
                <h3>
                  Address: {account.address}
                  <i
                    className="fas fa-copy"
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => copyToClipboard(account.address)}
                  ></i>
                  {copiedAddress === account.address && <span> Copied!</span>}
                </h3>
                <h3>Balance: {account.balance} ETH</h3>
              </div>
            </div>
          ))
        ) : (
          <div>
            <button
              onClick={connectToWallet}
              className='bg-zinc-900 px-8 py-4 text-xl rounded-2xl text-white font-semibold'>
              Connect to Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectToWallet;
