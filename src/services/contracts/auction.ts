import * as anchor from '@project-serum/anchor'
import {
  Connection,
  Keypair,
  Commitment,
  ConnectionConfig,
  SystemProgram,
  PublicKey,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';

import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { getParsedAccountByMint } from '@nfteyez/sol-rayz';
import { makeTransaction } from '../../helper/composables/sol/connection';
import createAssociatedTokenAccountInstruction from '../../helper/composables';
import { delay } from '../../utils';

import CONFIG from "../../config";
import { AnchorWallet, WalletContext, WalletContextState } from '@solana/wallet-adapter-react';

const {
  AUCTION,
  CLUSTER_API,
  TokenAddress,
  ADMIN_WALLET,
  COMMUNITY_WALLET,
  DECIMAL
} = CONFIG;

const connection = new Connection(CLUSTER_API, {
  skipPreflight: true,
  preflightCommitment: 'confirmed' as Commitment,
} as ConnectionConfig);


export const getAdminsForAuction = async (
  wallet: any,
) => {
  try {

    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)
    console.log("connection", connection)
    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);
    console.log("program", program)

    const [user] = await PublicKey.findProgramAddress([
      Buffer.from("user_"),
      new PublicKey(wallet.publicKey).toBuffer()
    ], new PublicKey(AUCTION.PROGRAM_ID))

    console.log("wallet public key", wallet.publicKey.toString())

    let feeObject = await program.account.user.fetch(user);

    return {success: true, data: feeObject};

  }
  catch (error) {
    return {success: false};
  }
}


export const getFeeForAuction = async (
  wallet: any,
) => {
  try {

    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)
    console.log("connection", connection)
    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);
    console.log("program", program)

    const [feeAccount] = await PublicKey.findProgramAddress([
      Buffer.from("auction_fee"),
    ], new PublicKey(AUCTION.PROGRAM_ID))

    console.log("wallet public key", wallet.publicKey.toString())

    let feeObject = await program.account.auctionState.fetch(feeAccount);

    return {success: true, data: feeObject};

  }
  catch (error) {
    return {success: false};
  }
}

export const initAdminForAuction = async (
  wallet: any,
) => {
  try {

    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)
    console.log("connection", connection)
    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);
    console.log("program", program)
    const [user] = await PublicKey.findProgramAddress([
      Buffer.from("user_"),
      new PublicKey(wallet.publicKey).toBuffer()
    ], new PublicKey(AUCTION.PROGRAM_ID))

    console.log("wallet public key", wallet.publicKey.toString())

    let builder: any;
    try {
      builder = program.methods.createUser();
    } catch (error) {
      console.log('error in createAdmin method', error);
    }

    builder.accounts({
      owner: wallet.publicKey,
      user:  user,
      systemProgram: SystemProgram.programId,
      // rent: SYSVAR_RENT_PUBKEY
    });

    let txId;
    
    try {
      txId = await builder.rpc();
      console.log('txId', txId)
    } catch(error) {
      console.log('error', error)
    }
    if (!txId) return false;

    return true;

  }
  catch (error) {
    return false;
  }
}

export const addAdminForAuction = async (
  wallet: any,
  admin: any,
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)

    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);

    const [user] = await PublicKey.findProgramAddress([
      Buffer.from("user_"),
      new PublicKey(wallet.publicKey).toBuffer()
    ], new PublicKey(AUCTION.PROGRAM_ID))
    

    // const builder = program.methods.createAdmin();

    
    // builder.accounts({
    //   owner: wallet.publicKey,
    //   admin: new PublicKey(admin),
    //   user:  user,
    //   systemProgram: SystemProgram.programId,
    //   // rent: SYSVAR_RENT_PUBKEY
    // });


    // builder.signers([]);

    const userInfo: any = await connection.getAccountInfo(user);
    console.log('userInfo', userInfo);
    let txId;
    if (!userInfo) {
      txId = await program.rpc.createAdmin(
        {
            accounts: {
              owner: wallet.publicKey,
              admin: new PublicKey(admin),
              user:  user,
              systemProgram: SystemProgram.programId,
            },
            instructions: [
              await program.instruction.createUser({
                accounts: {
                  owner: wallet.publicKey,
                  user: user,
                  systemProgram: SystemProgram.programId
                }
              }),
            ],
        }
      );
    } else {
      txId = await program.rpc.createAdmin(
        {
            accounts: {
              owner: wallet.publicKey,
              admin: new PublicKey(admin),
              user:  user,
              systemProgram: SystemProgram.programId,
            }
        }
      );
    }

    try {
      console.log('txId', txId)
    } catch (error) {
      console.log('error', error)
    }

    if (!txId) 
      return false;

    return true;
  } catch (error) {
    return false;
  }
}


export const removeAdminForAuction = async (
  wallet: any,
  admin: any,
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)

    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);

    const [user] = await PublicKey.findProgramAddress([
      Buffer.from("user_"),
      new PublicKey(wallet.publicKey).toBuffer()
    ], new PublicKey(AUCTION.PROGRAM_ID))

    const builder = program.methods.removeAdmin();

    builder.accounts({
      owner: wallet.publicKey,
      admin: new PublicKey(admin),
      user:  user,
      systemProgram: SystemProgram.programId,
      // rent: SYSVAR_RENT_PUBKEY
    });


    builder.signers([]);

    let txId;
    try {
      txId = await builder.rpc();
      console.log('txId', txId)
    } catch (error) {
      console.log('error', error)
    }

    if (!txId) 
      return false;

    return true;
  } catch (error) {
    return false;
  }
}

export const setFeeForAuction = async (
  wallet: any,
  _fee1: any,
  _fee2: any,
  _fee3: any) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)

    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);

    const [feeAccount] = await PublicKey.findProgramAddress([
      Buffer.from("auction_fee"),
    ], new PublicKey(AUCTION.PROGRAM_ID))

    let builder: any;
    const fee1: any = new anchor.BN(_fee1)
    const fee2: any = new anchor.BN(_fee2)
    const fee3: any = new anchor.BN(_fee3)

    builder = program.methods.setFee(fee1, fee2, fee3);

    builder.accounts({
      feeAccount: feeAccount,
      admin: wallet.publicKey,
      systemProgram: SystemProgram.programId,
      // rent: SYSVAR_RENT_PUBKEY
    });

    builder.signers([]);

    let txId;
    try {
      txId = await builder.rpc();
      console.log('txId', txId)
    } catch (error) {
      console.log('error', error)
    }

    if (!txId) 
      return false;

    return true;
  } catch (error) {
  
  }
}

export const createForAuction = async (
  wallet: any,
  nftInfo: any,
  auctionId: number
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)

    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);

    const id = new anchor.BN(auctionId);
    const [pool] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION.POOL_SEED),
      id.toArrayLike(Buffer, 'le', 8),
      new PublicKey(nftInfo.mint).toBuffer()],
      program.programId
    );

    // let ataFrom = await getAssociatedTokenAddress(new PublicKey(nftInfo.mint), wallet.publicKey);
    const mintInfo = await getParsedAccountByMint({ mintAddress: nftInfo.mint, connection })
    let ataFrom = mintInfo.pubkey
    let ataTo = await getAssociatedTokenAddress(new PublicKey(nftInfo.mint), pool, true);

    const startTime = Math.floor(nftInfo.start_date?.getTime() / 1000)
    const endTime = Math.floor(nftInfo.end_date?.getTime() / 1000)
    // const minNftCount = Number(nftInfo.min_nft_count)

    console.log("=========min_bid_amount", nftInfo.min_bid_amount)
    console.log("=========min_bid_increment", nftInfo.min_bid_increment)
    // console.log("=========min_nft_count", nftInfo.min_nft_count)
    const builder = program.methods.createAuction(
      id,
      startTime,
      endTime,
      new anchor.BN(Number(nftInfo.min_bid_amount) * CONFIG.DECIMAL),
      new anchor.BN(Number(nftInfo.min_bid_increment) * CONFIG.DECIMAL)
    );

    
    const [feeAccount] = await PublicKey.findProgramAddress([
      Buffer.from("auction_fee"),
    ], new PublicKey(AUCTION.PROGRAM_ID))

    const [treasury] = await PublicKey.findProgramAddress([
      Buffer.from("auction_treasury"),
    ], new PublicKey(AUCTION.PROGRAM_ID))


    builder.accounts({
      admin: wallet.publicKey,
      mint: new PublicKey(nftInfo.mint),
      pool: pool,
      treasury,
      feeAccount,
      ataFrom: ataFrom,
      ataTo: ataTo,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    });

    builder.signers([]);

    let txId;
    try {
      txId = await builder.rpc();
      console.log('txId', txId)
    } catch (error) {
      console.log('error', error)
    }

    if (!txId) 
      return false;

    return true;
  } catch (error) {
  
  }
}

export const updateForAuction = async (
  wallet: any,
  nftInfo: any
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)

    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);

    const id = new anchor.BN(nftInfo.id);
    const [pool] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION.POOL_SEED),
      id.toArrayLike(Buffer, 'le', 8),
      new PublicKey(nftInfo.mint).toBuffer()],
      program.programId
    );
    const startTime = Math.floor(nftInfo.start_date?.getTime() / 1000)
    const endTime = Math.floor(nftInfo.end_date?.getTime() / 1000)
    // const minNftCount = Number(nftInfo.min_nft_count)
    const builder = program.methods.editAuction(
      startTime,
      endTime,
      new anchor.BN(nftInfo.min_bid_amount * CONFIG.DECIMAL),
      new anchor.BN(nftInfo.min_bid_increment * CONFIG.DECIMAL),
    );
    builder.accounts({
      admin: wallet.publicKey,
      pool: pool
    });

    builder.signers([]);

    const txId = await builder.rpc();
    console.log('txId', txId)

    if (!txId) return false;

    return true;

  } catch (error) {
    return null
  }
}

export const deleteForAuction = async (
  wallet: any,
  nftInfo: any
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)

    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);

    const id = new anchor.BN(nftInfo.id);
    const [pool] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION.POOL_SEED),
      id.toArrayLike(Buffer, 'le', 8),
      new PublicKey(nftInfo.mint).toBuffer()],
      program.programId
    );

    const builder = program.methods.deleteAuction();
    let ataFrom = await getAssociatedTokenAddress(new PublicKey(nftInfo.mint), pool, true);
    let ataTo = await getAssociatedTokenAddress(new PublicKey(nftInfo.mint), wallet.publicKey);
    builder.accounts({
      admin: wallet.publicKey,
      pool: pool,
      mint: new PublicKey(nftInfo.mint),
      ataFrom,
      ataTo,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    });
    builder.signers([]);
    const txId = await builder.rpc();
    console.log('txId', txId);
    if (!txId) return false;

    return true;
  } catch (error) {
  }
}

export const createBidForAuction = async (
  wallet: AnchorWallet,
  nftInfo: any,
  price: number,
  nftCount: number
) => {
  try {
    console.log('nftInfo',nftInfo)
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)

    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);

    const id = new anchor.BN(nftInfo.id);
    const [pool] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION.POOL_SEED),
      id.toArrayLike(Buffer, 'le', 8),
      new PublicKey(nftInfo.mint).toBuffer()],
      program.programId
    );

    let ataFrom = await getAssociatedTokenAddress(new PublicKey(TokenAddress), wallet.publicKey);
    let ataTo = await getAssociatedTokenAddress(new PublicKey(TokenAddress), pool, true)
    
    const builder = program.methods.createBid(new anchor.BN(price * DECIMAL), nftCount);
    console.log('bidder', wallet.publicKey.toString())
    
    const [feeAccount] = await PublicKey.findProgramAddress([
      Buffer.from("auction_fee"),
    ], new PublicKey(AUCTION.PROGRAM_ID))

    const [treasury] = await PublicKey.findProgramAddress([
      Buffer.from("auction_treasury"),
    ], new PublicKey(AUCTION.PROGRAM_ID))

    builder.accounts({
      bidder: wallet.publicKey,
      pool: pool,
      feeAccount,
      treasury,
      payMint: new PublicKey(TokenAddress),
      ataFrom: ataFrom,
      ataTo: ataTo,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    });

    builder.signers([]);

    const txId = await builder.rpc();
    if (!txId) return false;
    console.log('txId', txId)
    return true;

  }
  catch (error) {
    console.log('error',error)
    return false;
  }
}

export const updateBidForAuction = async (
  wallet: any,
  nftInfo: any,
  price: number,
  nftCount: number
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)

    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);

    const id = new anchor.BN(nftInfo.id);
    const [pool] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION.POOL_SEED),
      id.toArrayLike(Buffer, 'le', 8),
      new PublicKey(nftInfo.mint).toBuffer()],
      program.programId
    );

    let ataFrom = await getAssociatedTokenAddress(new PublicKey(TokenAddress), wallet.publicKey);
    let ataTo = await getAssociatedTokenAddress(new PublicKey(TokenAddress), pool, true)
    const builder = program.methods.updateBid(new anchor.BN(price * DECIMAL), nftCount);
    builder.accounts({
      bidder: wallet.publicKey,
      pool: pool,
      payMint: TokenAddress,
      ataFrom: ataFrom,
      ataTo: ataTo,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    });

    builder.signers([]);
    let txId
    try {
      txId = await builder.rpc();
      await delay(7  * 1000)
      console.log('txId', txId)
    } catch(error) {

    }
    if (!txId) return false;
    console.log('txId', txId)
    return true;

  }
  catch (error) {
    return null;
  }
}

export const cancelBidForAuction = async (
  wallet: any,
  nftInfo: any,

) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)

    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);

    const id = new anchor.BN(nftInfo.id);
    const [pool] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION.POOL_SEED),
      id.toArrayLike(Buffer, 'le', 8),
      new PublicKey(nftInfo.mint).toBuffer()],
      program.programId
    );

    let ataFrom = await getAssociatedTokenAddress(new PublicKey(TokenAddress), pool, true);
    let ataTo = await getAssociatedTokenAddress(new PublicKey(TokenAddress), wallet?.publicKey);
    const builder = program.methods.cancelBid();
    builder.accounts({
      bidder: wallet.publicKey,
      pool: pool,
      payMint: new PublicKey(TokenAddress),
      ataFrom: ataFrom,
      ataTo: ataTo,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    });
    builder.signers([]);

    let txId
    try {
      txId = await builder.rpc();
      await delay(7  * 1000)
      console.log('txId', txId)
    } catch(error) {

    }
    if (!txId) return false;

    return true;
  }
  catch (error) {
    return null;
  }
}

export const claimBid = async (
  wallet: any,
  nftInfo: any,
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)


    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);

    const id = new anchor.BN(nftInfo.id)
    const [pool] = await PublicKey.findProgramAddress([
      Buffer.from(AUCTION.POOL_SEED),
      id.toArrayLike(Buffer, 'le', 8),
      new PublicKey(nftInfo.mint).toBuffer()
    ], new PublicKey(AUCTION.PROGRAM_ID))

    let ataFrom = await getAssociatedTokenAddress(new PublicKey(TokenAddress), pool, true);
    let ataTo = await getAssociatedTokenAddress(new PublicKey(TokenAddress), wallet.publicKey)

    const [feeAccount] = await PublicKey.findProgramAddress([
      Buffer.from("auction_fee"),
    ], new PublicKey(AUCTION.PROGRAM_ID))

    const [treasury] = await PublicKey.findProgramAddress([
      Buffer.from("auction_treasury"),
    ], new PublicKey(AUCTION.PROGRAM_ID))

    const builder = program.methods.claimBid();
    builder.accounts({
      bidder: wallet.publicKey,
      pool: pool,
      feeAccount,
      treasury,
      payMint: TokenAddress,
      ataFrom: ataFrom,
      ataTo: ataTo,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    });

    builder.signers([]);
    let txId
    try {
      txId = await builder.rpc();
      await delay(7  * 1000)
      console.log('txId', txId)
    } catch(error) {

    }
    if (!txId) return false;

    return true;

  }
  catch (error) {
    return null;
  }
}

export const claimAllBid = async (
  wallet: any,
  nftInfos: any[],
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)

    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);
    let instructions: any = [], signers: any = [];
    
    for(let i = 0; i < nftInfos.length; i++) { 
      const id = nftInfos[i].auctionId
      const [pool] = await PublicKey.findProgramAddress([
        Buffer.from(AUCTION.POOL_SEED),
        id.toArrayLike(Buffer, 'le', 8),
        nftInfos[i].mint.toBuffer()
      ], new PublicKey(AUCTION.PROGRAM_ID))
  
      let ataFrom = await getAssociatedTokenAddress(new PublicKey(TokenAddress), pool, true);
      let ataTo = await getAssociatedTokenAddress(new PublicKey(TokenAddress), wallet.publicKey)

      const ataToInfo = await connection.getAccountInfo(ataTo);
      if (!ataToInfo) {
        instructions.push(createAssociatedTokenAccountInstruction(wallet.publicKey, ataTo, wallet.publicKey, new PublicKey(CONFIG.TokenAddress)))
      }

      const [feeAccount] = await PublicKey.findProgramAddress([
        Buffer.from("auction_fee"),
      ], new PublicKey(AUCTION.PROGRAM_ID))

      const [treasury] = await PublicKey.findProgramAddress([
        Buffer.from("auction_treasury"),
      ], new PublicKey(AUCTION.PROGRAM_ID))

      instructions.push(program.instruction.claimBid({
        accounts: {
          bidder: wallet.publicKey,
          pool: pool,
          feeAccount,
          treasury,
          payMint: TokenAddress,
          ataFrom: ataFrom,
          ataTo: ataTo,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        }
      }))
    }
    const transaction = await makeTransaction(connection, instructions, signers, wallet.publicKey)
  
    return transaction

  }
  catch (error) {
    console.log('error', error)
    return null;
  }
}

export const claimPrize = async (
  wallet: any,
  nftInfo: any,

) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig)


    const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);

    const id = new anchor.BN(nftInfo.id)
    const [pool] = await PublicKey.findProgramAddress([
      Buffer.from(AUCTION.POOL_SEED),
      id.toArrayLike(Buffer, 'le', 8),
      new PublicKey(nftInfo.mint).toBuffer()
    ], new PublicKey(AUCTION.PROGRAM_ID))

    let ataFrom = await getAssociatedTokenAddress(new PublicKey(nftInfo.mint), pool, true);
    let ataTo = await getAssociatedTokenAddress(new PublicKey(nftInfo.mint), wallet.publicKey)

    let tokenFrom = await getAssociatedTokenAddress(new PublicKey(TokenAddress), pool, true);
    let tokenTo = await getAssociatedTokenAddress(new PublicKey(TokenAddress), new PublicKey(COMMUNITY_WALLET))
 
    let instructions = [];
    const ataInfo: any = await connection.getParsedAccountInfo(tokenTo);
    
    const [treasury] = await PublicKey.findProgramAddress([
      Buffer.from("auction_treasury"),
    ], new PublicKey(AUCTION.PROGRAM_ID))

    let txId

    if(!ataInfo){
      txId = await program.rpc.claimPrize(
        {
            accounts: {
              community: new PublicKey(COMMUNITY_WALLET),
              bidder: wallet.publicKey,
              pool: pool,
              treasury,
              mint: new PublicKey(nftInfo.mint),
              ataFrom: ataFrom,
              ataTo: ataTo,
              // payMint: new PublicKey(TokenAddress),
              tokenFrom: tokenFrom,
              tokenTo: tokenTo,
              tokenProgram: TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
              rent: SYSVAR_RENT_PUBKEY
            },
            instructions: [
                await createAssociatedTokenAccountInstruction(wallet.publicKey, tokenTo, new PublicKey(COMMUNITY_WALLET), new PublicKey(TokenAddress)),
            ],
          }
      );
    }else {
      txId = await program.rpc.claimPrize(
        {
            accounts: {
              community: new PublicKey(COMMUNITY_WALLET),
              bidder: wallet.publicKey,
              pool: pool,
              treasury,
              mint: new PublicKey(nftInfo.mint),
              ataFrom: ataFrom,
              ataTo: ataTo,
              // payMint: new PublicKey(TokenAddress),
              tokenFrom: tokenFrom,
              tokenTo: tokenTo,
              tokenProgram: TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
              rent: SYSVAR_RENT_PUBKEY
            },
        }
      );
    }


    try {
      console.log('txId', txId)
    } catch(error) {

    }
    if (!txId) return false;

    return true;

  }
  catch (error) {
    return null;
  }
}