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

  // Since we don't have the ABI, we perform a simple 0-value transaction 
  // to the contract address. This registers an interaction on the network.
  // If the contract has a specific function to call, we would encode it in 'data'.
  // For now, we assume a fallback or receive function exists, or we just want 
  // to increment the nonce/interact with the address.
  
  const transactionParameters = {
    to: TARGET_CONTRACT_ADDRESS,
    from: fromAddress,
    value: '0x0', // 0 CELO
    // data: '0x', // Optional: Add specific function selector if known. 
  };

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    return txHash;
  } catch (error: any) {
    throw new Error(error.message || "Transaction rejected or failed.");
  }
};