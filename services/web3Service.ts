import { CELO_CHAIN_ID_HEX, TARGET_CONTRACT_ADDRESS } from '../types';

// Declare global ethereum object
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectWallet = async (): Promise<string> => {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found. Please install Celo Extension Wallet or MetaMask.");
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error: any) {
    throw new Error(error.message || "Failed to connect wallet.");
  }
};

export const switchToCeloNetwork = async (): Promise<void> => {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CELO_CHAIN_ID_HEX }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: CELO_CHAIN_ID_HEX,
              chainName: 'Celo Mainnet',
              nativeCurrency: {
                name: 'CELO',
                symbol: 'CELO',
                decimals: 18,
              },
              rpcUrls: ['https://forno.celo.org'],
              blockExplorerUrls: ['https://explorer.celo.org'],
            },
          ],
        });
      } catch (addError: any) {
        throw new Error("Failed to add Celo network to wallet.");
      }
    } else {
      throw new Error("Failed to switch to Celo network.");
    }
  }
};

export const sendInteractionTransaction = async (fromAddress: string): Promise<string> => {
  if (!window.ethereum) throw new Error("Wallet not found");

  // We are calling the 'mint()' function on the contract to register the interaction.
  // The function selector for mint() is 0x1249c58b (Keccak-256 of "mint()").
  // This solves the issue of the contract reverting on empty data transfers.
  const functionSelector = '0x1249c58b'; 

  const transactionParameters = {
    to: TARGET_CONTRACT_ADDRESS,
    from: fromAddress,
    value: '0x0', // 0 CELO
    data: functionSelector, 
  };

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    return txHash;
  } catch (error: any) {
    console.error("Transaction failed:", error);
    throw new Error(error.message || "Transaction rejected or failed. Please ensure you have CELO for gas.");
  }
};