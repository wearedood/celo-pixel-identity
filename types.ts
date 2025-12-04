export interface WalletState {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
}

export enum AppStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  INTERACTING = 'INTERACTING', // Waiting for blockchain tx
  GENERATING = 'GENERATING',   // Waiting for AI
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface PixelArtResult {
  cryptoName: string;
  imageUrl: string;
  trait: string;
}

export const CELO_CHAIN_ID_HEX = '0xa4ec'; // 42220
export const CELO_CHAIN_ID_DECIMAL = 42220;

export const TARGET_CONTRACT_ADDRESS = "0xa81ef6dfac382c1c912e226575e8ac8caac37169";

export const CRYPTO_PERSONAS = [
  { name: 'Bitcoin', trait: 'The OG Leader' },
  { name: 'Ethereum', trait: 'The Smart Visionary' },
  { name: 'Celo', trait: 'The Eco-Friendly Builder' },
  { name: 'Solana', trait: 'The Speed Demon' },
  { name: 'Dogecoin', trait: 'The Fun Lover' },
  { name: 'Polygon', trait: 'The Scalable Strategist' },
  { name: 'Cardano', trait: 'The Academic Perfectionist' },
  { name: 'Avalanche', trait: 'The Rapid Innovator' }
];