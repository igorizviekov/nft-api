/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface NFTMarketplaceInterface extends utils.Interface {
  functions: {
    "MAX_PRICE()": FunctionFragment;
    "MIN_PRICE()": FunctionFragment;
    "approveMintRequest(uint256)": FunctionFragment;
    "buyNFT(uint256,uint256,string)": FunctionFragment;
    "delistNFT(uint256)": FunctionFragment;
    "getMintRequestDetails(uint256)": FunctionFragment;
    "isTokenListed(uint256)": FunctionFragment;
    "listNFT(uint256,uint256)": FunctionFragment;
    "mintRequestIdTracker()": FunctionFragment;
    "mintRequests(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "payee(uint256)": FunctionFragment;
    "releasable(address)": FunctionFragment;
    "releasable(address,address)": FunctionFragment;
    "release(address)": FunctionFragment;
    "release(address,address)": FunctionFragment;
    "released(address,address)": FunctionFragment;
    "released(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "shares(address)": FunctionFragment;
    "totalReleased(address)": FunctionFragment;
    "totalReleased()": FunctionFragment;
    "totalShares()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "MAX_PRICE"
      | "MIN_PRICE"
      | "approveMintRequest"
      | "buyNFT"
      | "delistNFT"
      | "getMintRequestDetails"
      | "isTokenListed"
      | "listNFT"
      | "mintRequestIdTracker"
      | "mintRequests"
      | "owner"
      | "payee"
      | "releasable(address)"
      | "releasable(address,address)"
      | "release(address)"
      | "release(address,address)"
      | "released(address,address)"
      | "released(address)"
      | "renounceOwnership"
      | "shares"
      | "totalReleased(address)"
      | "totalReleased()"
      | "totalShares"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "MAX_PRICE", values?: undefined): string;
  encodeFunctionData(functionFragment: "MIN_PRICE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "approveMintRequest",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "buyNFT",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "delistNFT",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getMintRequestDetails",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isTokenListed",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "listNFT",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "mintRequestIdTracker",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mintRequests",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "payee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "releasable(address)",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "releasable(address,address)",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "release(address)",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "release(address,address)",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "released(address,address)",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "released(address)",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "shares",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "totalReleased(address)",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "totalReleased()",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalShares",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "MAX_PRICE", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "MIN_PRICE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "approveMintRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "buyNFT", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "delistNFT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getMintRequestDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isTokenListed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "listNFT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "mintRequestIdTracker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintRequests",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "payee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "releasable(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "releasable(address,address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "release(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "release(address,address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "released(address,address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "released(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "shares", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalReleased(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalReleased()",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalShares",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "ERC20PaymentReleased(address,address,uint256)": EventFragment;
    "MintRequestApproved(uint256,uint256)": EventFragment;
    "NFTBought(uint256)": EventFragment;
    "NFTDelisted(uint256)": EventFragment;
    "NFTListed(uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "PayeeAdded(address,uint256)": EventFragment;
    "PaymentReceived(address,uint256)": EventFragment;
    "PaymentReleased(address,uint256)": EventFragment;
    "TokenMintRequest(uint256,address,string,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ERC20PaymentReleased"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MintRequestApproved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NFTBought"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NFTDelisted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NFTListed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PayeeAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PaymentReceived"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PaymentReleased"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenMintRequest"): EventFragment;
}

export interface ERC20PaymentReleasedEventObject {
  token: string;
  to: string;
  amount: BigNumber;
}
export type ERC20PaymentReleasedEvent = TypedEvent<
  [string, string, BigNumber],
  ERC20PaymentReleasedEventObject
>;

export type ERC20PaymentReleasedEventFilter =
  TypedEventFilter<ERC20PaymentReleasedEvent>;

export interface MintRequestApprovedEventObject {
  requestId: BigNumber;
  tokenId: BigNumber;
}
export type MintRequestApprovedEvent = TypedEvent<
  [BigNumber, BigNumber],
  MintRequestApprovedEventObject
>;

export type MintRequestApprovedEventFilter =
  TypedEventFilter<MintRequestApprovedEvent>;

export interface NFTBoughtEventObject {
  tokenId: BigNumber;
}
export type NFTBoughtEvent = TypedEvent<[BigNumber], NFTBoughtEventObject>;

export type NFTBoughtEventFilter = TypedEventFilter<NFTBoughtEvent>;

export interface NFTDelistedEventObject {
  tokenId: BigNumber;
}
export type NFTDelistedEvent = TypedEvent<[BigNumber], NFTDelistedEventObject>;

export type NFTDelistedEventFilter = TypedEventFilter<NFTDelistedEvent>;

export interface NFTListedEventObject {
  tokenId: BigNumber;
}
export type NFTListedEvent = TypedEvent<[BigNumber], NFTListedEventObject>;

export type NFTListedEventFilter = TypedEventFilter<NFTListedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface PayeeAddedEventObject {
  account: string;
  shares: BigNumber;
}
export type PayeeAddedEvent = TypedEvent<
  [string, BigNumber],
  PayeeAddedEventObject
>;

export type PayeeAddedEventFilter = TypedEventFilter<PayeeAddedEvent>;

export interface PaymentReceivedEventObject {
  from: string;
  amount: BigNumber;
}
export type PaymentReceivedEvent = TypedEvent<
  [string, BigNumber],
  PaymentReceivedEventObject
>;

export type PaymentReceivedEventFilter = TypedEventFilter<PaymentReceivedEvent>;

export interface PaymentReleasedEventObject {
  to: string;
  amount: BigNumber;
}
export type PaymentReleasedEvent = TypedEvent<
  [string, BigNumber],
  PaymentReleasedEventObject
>;

export type PaymentReleasedEventFilter = TypedEventFilter<PaymentReleasedEvent>;

export interface TokenMintRequestEventObject {
  requestId: BigNumber;
  buyer: string;
  tokenURI: string;
  price: BigNumber;
}
export type TokenMintRequestEvent = TypedEvent<
  [BigNumber, string, string, BigNumber],
  TokenMintRequestEventObject
>;

export type TokenMintRequestEventFilter =
  TypedEventFilter<TokenMintRequestEvent>;

export interface NFTMarketplace extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: NFTMarketplaceInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    MAX_PRICE(overrides?: CallOverrides): Promise<[BigNumber]>;

    MIN_PRICE(overrides?: CallOverrides): Promise<[BigNumber]>;

    approveMintRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    buyNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      collectionId: PromiseOrValue<BigNumberish>,
      tokenURI: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    delistNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getMintRequestDetails(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, BigNumber, string, boolean] & {
        collectionId: BigNumber;
        tokenURI: string;
        price: BigNumber;
        buyer: string;
        approved: boolean;
      }
    >;

    isTokenListed(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    listNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    mintRequestIdTracker(overrides?: CallOverrides): Promise<[BigNumber]>;

    mintRequests(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, BigNumber, string, boolean] & {
        collectionId: BigNumber;
        tokenURI: string;
        price: BigNumber;
        buyer: string;
        approved: boolean;
      }
    >;

    owner(overrides?: CallOverrides): Promise<[string]>;

    payee(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "releasable(address)"(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "releasable(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "release(address)"(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    "release(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    "released(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "released(address)"(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    shares(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "totalReleased(address)"(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "totalReleased()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalShares(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  MAX_PRICE(overrides?: CallOverrides): Promise<BigNumber>;

  MIN_PRICE(overrides?: CallOverrides): Promise<BigNumber>;

  approveMintRequest(
    requestId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  buyNFT(
    tokenId: PromiseOrValue<BigNumberish>,
    collectionId: PromiseOrValue<BigNumberish>,
    tokenURI: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  delistNFT(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getMintRequestDetails(
    requestId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string, BigNumber, string, boolean] & {
      collectionId: BigNumber;
      tokenURI: string;
      price: BigNumber;
      buyer: string;
      approved: boolean;
    }
  >;

  isTokenListed(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  listNFT(
    tokenId: PromiseOrValue<BigNumberish>,
    newPrice: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  mintRequestIdTracker(overrides?: CallOverrides): Promise<BigNumber>;

  mintRequests(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string, BigNumber, string, boolean] & {
      collectionId: BigNumber;
      tokenURI: string;
      price: BigNumber;
      buyer: string;
      approved: boolean;
    }
  >;

  owner(overrides?: CallOverrides): Promise<string>;

  payee(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  "releasable(address)"(
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "releasable(address,address)"(
    token: PromiseOrValue<string>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "release(address)"(
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  "release(address,address)"(
    token: PromiseOrValue<string>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  "released(address,address)"(
    token: PromiseOrValue<string>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "released(address)"(
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  shares(
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "totalReleased(address)"(
    token: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "totalReleased()"(overrides?: CallOverrides): Promise<BigNumber>;

  totalShares(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    MAX_PRICE(overrides?: CallOverrides): Promise<BigNumber>;

    MIN_PRICE(overrides?: CallOverrides): Promise<BigNumber>;

    approveMintRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    buyNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      collectionId: PromiseOrValue<BigNumberish>,
      tokenURI: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    delistNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getMintRequestDetails(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, BigNumber, string, boolean] & {
        collectionId: BigNumber;
        tokenURI: string;
        price: BigNumber;
        buyer: string;
        approved: boolean;
      }
    >;

    isTokenListed(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    listNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      newPrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    mintRequestIdTracker(overrides?: CallOverrides): Promise<BigNumber>;

    mintRequests(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, BigNumber, string, boolean] & {
        collectionId: BigNumber;
        tokenURI: string;
        price: BigNumber;
        buyer: string;
        approved: boolean;
      }
    >;

    owner(overrides?: CallOverrides): Promise<string>;

    payee(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    "releasable(address)"(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "releasable(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "release(address)"(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    "release(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    "released(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "released(address)"(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    shares(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "totalReleased(address)"(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "totalReleased()"(overrides?: CallOverrides): Promise<BigNumber>;

    totalShares(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ERC20PaymentReleased(address,address,uint256)"(
      token?: PromiseOrValue<string> | null,
      to?: null,
      amount?: null
    ): ERC20PaymentReleasedEventFilter;
    ERC20PaymentReleased(
      token?: PromiseOrValue<string> | null,
      to?: null,
      amount?: null
    ): ERC20PaymentReleasedEventFilter;

    "MintRequestApproved(uint256,uint256)"(
      requestId?: null,
      tokenId?: null
    ): MintRequestApprovedEventFilter;
    MintRequestApproved(
      requestId?: null,
      tokenId?: null
    ): MintRequestApprovedEventFilter;

    "NFTBought(uint256)"(
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): NFTBoughtEventFilter;
    NFTBought(
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): NFTBoughtEventFilter;

    "NFTDelisted(uint256)"(
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): NFTDelistedEventFilter;
    NFTDelisted(
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): NFTDelistedEventFilter;

    "NFTListed(uint256)"(
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): NFTListedEventFilter;
    NFTListed(
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): NFTListedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "PayeeAdded(address,uint256)"(
      account?: null,
      shares?: null
    ): PayeeAddedEventFilter;
    PayeeAdded(account?: null, shares?: null): PayeeAddedEventFilter;

    "PaymentReceived(address,uint256)"(
      from?: null,
      amount?: null
    ): PaymentReceivedEventFilter;
    PaymentReceived(from?: null, amount?: null): PaymentReceivedEventFilter;

    "PaymentReleased(address,uint256)"(
      to?: null,
      amount?: null
    ): PaymentReleasedEventFilter;
    PaymentReleased(to?: null, amount?: null): PaymentReleasedEventFilter;

    "TokenMintRequest(uint256,address,string,uint256)"(
      requestId?: PromiseOrValue<BigNumberish> | null,
      buyer?: null,
      tokenURI?: null,
      price?: null
    ): TokenMintRequestEventFilter;
    TokenMintRequest(
      requestId?: PromiseOrValue<BigNumberish> | null,
      buyer?: null,
      tokenURI?: null,
      price?: null
    ): TokenMintRequestEventFilter;
  };

  estimateGas: {
    MAX_PRICE(overrides?: CallOverrides): Promise<BigNumber>;

    MIN_PRICE(overrides?: CallOverrides): Promise<BigNumber>;

    approveMintRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    buyNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      collectionId: PromiseOrValue<BigNumberish>,
      tokenURI: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    delistNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getMintRequestDetails(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isTokenListed(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    listNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    mintRequestIdTracker(overrides?: CallOverrides): Promise<BigNumber>;

    mintRequests(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    payee(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "releasable(address)"(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "releasable(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "release(address)"(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    "release(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    "released(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "released(address)"(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    shares(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "totalReleased(address)"(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "totalReleased()"(overrides?: CallOverrides): Promise<BigNumber>;

    totalShares(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    MAX_PRICE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MIN_PRICE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    approveMintRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    buyNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      collectionId: PromiseOrValue<BigNumberish>,
      tokenURI: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    delistNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getMintRequestDetails(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTokenListed(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    listNFT(
      tokenId: PromiseOrValue<BigNumberish>,
      newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    mintRequestIdTracker(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mintRequests(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    payee(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "releasable(address)"(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "releasable(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "release(address)"(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    "release(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    "released(address,address)"(
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "released(address)"(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    shares(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "totalReleased(address)"(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "totalReleased()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalShares(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
