export interface ProofOfNFT {
    key: string;
    value: string;
    isPublic: boolean;
  }
  
  export interface SimpleImageData {
    filename: string;
    size: number;
    mimeType: string;
    sha3_512: string;
    storage: string;
  }
  export interface SimpleMintNFT {
    contractAddress: string;
    chain: string;
    name: string;
    description: string;
    collection: string;
    price: number;
    owner: string;
    image: SimpleImageData;
    keys: ProofOfNFT[];
  }