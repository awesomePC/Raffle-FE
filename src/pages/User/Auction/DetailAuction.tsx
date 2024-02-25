import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { Connection, Commitment, ConnectionConfig, PublicKey } from "@solana/web3.js";
import { Link } from "react-router-dom";
import Countdown, { CountdownApi } from "react-countdown";
import base58 from "bs58";
import CONFIG from "../../../config";
import { getAuctionById } from "../../../services/api";
import {
  cancelBidForAuction,
  claimBid,
  claimPrize,
  createBidForAuction,
  updateBidForAuction,
} from "../../../services/contracts/auction";
import UnionIcons from "../../../assets/Union-icons.png";
import VerificationIcon from "../../../assets/Verification-icon-2.png";
import ReturnIcon from "../../../assets/return-icon.png";
import TimingIcon from "../../../assets/Subtract-timing-icon.png";
import TicketIcon from "../../../assets/Subtract-ticket-icon.png";
import DateIcon from "../../../assets/Subtract.-date-icon.png";
import ShareIcon from "../../../assets/Share-icon.png";
import BidIcon from "../../../assets/Subtract-bid-icon.png";
import CurrentBidIcon from "../../../assets/Subtract-sol-price-icon.png";
import TimingAuctionIcon from "../../../assets/Subtract-tiiming-auction.png";
import Navbar from "../../../components/Navbar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import commonService from "../../../services/common.service";
import { VerifyCollection } from "../../../services/contracts/raffle";
import { updateAuction } from "../../../services/api";
import { delay, getSignedMessage } from "../../../utils";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const { CLUSTER_API, AUCTION, TokenAddress, DECIMAL, API_URL } = CONFIG;

const connection = new Connection(CLUSTER_API, {
  skipPreflight: true,
  preflightCommitment: "confirmed" as Commitment,
} as ConnectionConfig);

const DetailUserAuction = () => {
  const wallet = useWallet();
  const anchorWallet: any = useAnchorWallet();
  const { id } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [nftInfo, setNftInfo] = useState<any>([]);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  const [biddingStatus, setBiddingStatus] = useState(0);
  const [auctionStatus, setAuctionStatus] = useState(0);
  const [bidInfo, setBidInfo] = useState<any>(null);
  const [auctionInfo, showauctionInfo] = useState<string>("auctionInfo");
  const [ticketBuyerLists, setTicketBuyerLists] = useState<any>([]);
  const [currentBid, setCurrentBid] = useState(0);
  const [auctionClaimed, setAutionClaimed] = useState(false);
  const [auctionClaimPrized, setAuctionClaimPrized] = useState(false);
  const [ownNfts, setOwnNfts] = useState<any>([]);
  const [totalBidCount, setTotalBidCount] = useState(0);
  const [floorPrice, setFloorPrice] = useState("");
  const [winnerWalletAddress, setWinnerWalletAddress] = useState("");
  const [winnerPrice, setwinnerPrice] = useState(0);
  const [minBidAmount, setMinBidAmount] = useState(0);
  const [minBidIncrement, setMinBidIncrement] = useState(0);
  const [topBidAmount, setTopBidAmount] = useState(0);

  let startCountdownApi: CountdownApi | null = null;
  let countdownEndApi: CountdownApi | null = null;

  const setStartCountdownRef = (countdown: Countdown | null) => {
    if (countdown) {
      startCountdownApi = countdown.getApi();
    }
  };

  const setEndCountdownRef = (countdown: Countdown | null) => {
    if (countdown) {
      countdownEndApi = countdown.getApi();
    }
  };

  const startCountdownRenderer = ({ api, days, hours, minutes, seconds, completed }: any) => {
    if (api.isPaused()) api.start();
    return completed ? (
      <Countdown
        ref={setEndCountdownRef}
        date={nftInfo.end_date * 1000}
        zeroPadTime={3}
        onComplete={handleAuctionComplete}
        renderer={countdownEndRenderer}
      />
    ) : (
      <div className="flex gap-1">
        <p>Starts In</p>
        <p>
          {days.toString().length === 1 ? `0${days}` : days}:{hours.toString().length === 1 ? `0${hours}` : hours}:
          {minutes.toString().length === 1 ? `0${minutes}` : minutes}:
          {seconds.toString().length === 1 ? `0${seconds}` : seconds}
        </p>
      </div>
    );
  };

  const countdownEndRenderer = ({ api, days, hours, minutes, seconds, completed }: any) => {
    if (api.isPaused()) api.start();
    return completed ? (
      <p>ENDED</p>
    ) : (
      <div className="flex gap-1">
        <p>Live</p>
        <p>
          {days.toString().length === 1 ? `0${days}` : days}:{hours.toString().length === 1 ? `0${hours}` : hours}:
          {minutes.toString().length === 1 ? `0${minutes}` : minutes}:
          {seconds.toString().length === 1 ? `0${seconds}` : seconds}
        </p>
      </div>
    );
  };

  const handleCreateOrUpdateBid = async () => {
    try {
      if (!balance) {
        toast.error(`No tokens in your wallet.`);
        return;
      }
      if (!ownNfts.status) {
        toast.error(`No exist Specific NFT in your Wallet`);
        return;
      }
      // if (ownNfts.status && ownNfts.lists.length < (nftInfo.min_nft_count || 1)) {
      //   toast.error(`You have to ${nftInfo.min_nft_count || 1} or more Specific NFTs in your Wallet`);
      //   return;
      // }
      if (auctionStatus !== 1) {
        toast.error(`You can't bid now`);
        return;
      }

      if (amount < minBidAmount + minBidIncrement || balance < minBidAmount + minBidIncrement) {
        toast.error(`Bidding Or Owned Token amount must be bigger than Min.Bid Amount + Min.Bid Increment`);
        return;
      }

      setLoading(true);
      const price = amount;
      if (biddingStatus === 1) {
        const updateRes = await updateBidForAuction(anchorWallet, nftInfo, price, ownNfts.lists.length);

        if (updateRes) {
          toast.success("Success on updating bid");
          setCurrentBid(amount);

          setBalance(balance + (price - bidInfo.amount / DECIMAL));
          const findIdx = ticketBuyerLists.findIndex(
            (item: any) => item?.bidder?.toString() === anchorWallet?.publicKey?.toString()
          );

          const new_buyerLists = ticketBuyerLists.map((item: any, idx: any) => {
            return idx === findIdx ? { ...ticketBuyerLists[findIdx], price: Number(amount) * CONFIG.DECIMAL } : item;
          });

          setTicketBuyerLists(new_buyerLists);
        } else {
          toast.error("Fail on updating bid");
        }
      } else {
        const createRes = await createBidForAuction(anchorWallet, nftInfo, price, ownNfts.lists.length);
        if (createRes) {
          toast.success("Success on creating bid");
          setBiddingStatus(1);
          setBalance(balance - price);
          setCurrentBid(amount);

          setTicketBuyerLists([
            ...ticketBuyerLists,
            {
              bidder: new PublicKey(anchorWallet?.publicKey.toString()),
              price: Number(amount) * CONFIG.DECIMAL,
              isWinner: 0,
            },
          ]);
        } else {
          toast.error("Fail on creating bid");
        }
      }
      setLoading(false);
    } catch (error) {
      if (biddingStatus === 1) toast.error("Fail on updating bid");
      else toast.error("Fail on creating bid");
      setLoading(false);
    }
  };

  const handleDeleteBid = async () => {
    try {
      if (auctionStatus !== 1) return;
      setLoading(true);
      const res = await cancelBidForAuction(anchorWallet, nftInfo);
      if (res) {
        toast.success("Success on canceling bid");
        setBiddingStatus(0);
        setBalance(balance + Number(bidInfo.price) / DECIMAL);
        const findIdx = ticketBuyerLists.findIndex(
          (item: any) => item?.bidder?.toString() === anchorWallet?.publicKey?.toString()
        );

        const new_buyerLists = ticketBuyerLists.splice(findIdx, 1);

        const final_buyerLists = ticketBuyerLists.filter(
          (item: any) => item?.bidder?.toString() !== new_buyerLists[0]?.item?.bidder?.toString()
        );

        setTicketBuyerLists(final_buyerLists);
        setCurrentBid(0);
      } else {
        toast.error("Fail on canceling bid");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Fail on canceling bid");
    }
  };

  const handleClaimPrize = async () => {
    try {
      if (auctionClaimPrized) {
        toast.error(`Already You have claimed `);
        return;
      }
      setLoading(true);
      const res = await claimPrize(anchorWallet, nftInfo);
      if (res) {
        toast.success("Success on claiming prize");
        setAuctionClaimPrized(true);

        // const payload: any = new FormData();
        // payload.append("state", 1);

        // const signedMessage = await getSignedMessage(wallet, AUCTION.message);
        // payload.append("signedMessage", base58.encode(signedMessage!));
        // const res = await updateAuction(id, payload);
      } else {
        toast.error("Fail on claiming prize");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Fail on claiming prize");
    }
  };

  const handleClaimBid = async () => {
    try {
      if (auctionClaimed) {
        toast.error(`Already You have claimed `);
        return;
      }
      setLoading(true);
      const res = await claimBid(anchorWallet, nftInfo);
      if (res) {
        toast.success("Success on claiming bid");
        setAutionClaimed(true);
      } else {
        toast.error("Fail on claiming bid");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Fail on claiming bid");
    }
  };

  const onChangeSol = (e: any) => {
    setAmount(e.target.value);
  };

  const getTopBid = async (bids: any[], bidCount: any) => {
    const filterBuyerLists: any = [];
    for (let i = 0; i < bids.length; i++) {
      if (i < bidCount) {
        filterBuyerLists.push(bids[i]);
      }
    }

    let winner_buyerLists = [];
    for (let i = 0; i < filterBuyerLists.length; i++) {
      winner_buyerLists.push(Number(filterBuyerLists[i].price));
    }
    let high = 0;
    if (winner_buyerLists.length > 0) {
      high = Math.max.apply(Math, winner_buyerLists);
      return high / DECIMAL;
    } else return 0;
  };

  const getUserInfo = async (bids: any[], bidCount: any) => {
    const filterBuyerLists: any = [];
    for (let i = 0; i < bids.length; i++) {
      if (i < bidCount) {
        filterBuyerLists.push(bids[i]);
      }
    }

    const get_user: any = await commonService({
      method: `get`,
      route: `${API_URL}/user/${anchorWallet?.publicKey.toBase58()}`,
    });

    if (get_user) {
      if (get_user?.twitterName) {
        const filter = filterBuyerLists.map((item: any) => {
          return item?.bidder?.toString() === get_user?.walletAddress ? { ...item, name: get_user?.twitterName } : item;
        });
        setTicketBuyerLists(filter);
      } else if (get_user?.discordName) {
        const filter = filterBuyerLists.map((item: any) => {
          return item?.bidder?.toString() === get_user?.walletAddress ? { ...item, name: get_user?.discordName } : item;
        });
        setTicketBuyerLists(filter);
      } else {
        setTicketBuyerLists(filterBuyerLists);
      }
    } else {
      setTicketBuyerLists(filterBuyerLists);
    }

    setTicketBuyerLists(filterBuyerLists);

    const bid: any = filterBuyerLists.find((item: any) => {
      return item.bidder.toString() === anchorWallet?.publicKey?.toString();
    });

    if (bid) {
      // setAmount(bid.price.toNumber() / DECIMAL);
      setBiddingStatus(1);
      setBidInfo(bid);
    } else {
      setCurrentBid(0);
      setBiddingStatus(0);
      // setAmount(0)
    }
  };

  const getAuctionStatus = async (poolData: any) => {
    let status = 0;
    if (Date.now() > poolData.endTime * 1000) status = 2;
    else if (Date.now() > poolData.startTime * 1000) status = 1;
    const _topBidAmount = await getTopBid(poolData?.bids, poolData?.count);
    if (poolData.state >= 1) {
      status = 3;

      // const claimStatus = poolData?.bids.find((item: any) => item?.isWinner === 1 && item?.claimedPrize)
      if (poolData.state === 2) {
        setAuctionClaimPrized(true);
      }

      let filterBuyerLists = poolData?.bids;

      let winner_buyerLists = [];
      for (let i = 0; i < filterBuyerLists.length; i++) {
        winner_buyerLists.push(Number(filterBuyerLists[i].price));
      }
      let high = 0;
      if (winner_buyerLists.length > 0) {
        high = Math.max.apply(Math, winner_buyerLists);
        setTopBidAmount(high / DECIMAL);
      }

      const result: any = filterBuyerLists.find((item: any) => Number(item.price) === high);

      if (result) {
        setWinnerWalletAddress(result?.bidder?.toString());
        setwinnerPrice(Number(result?.price) / DECIMAL);
      }
    }

    setTopBidAmount(_topBidAmount);
    setAuctionStatus(status);
    setTotalBidCount(poolData?.count);
    setMinBidAmount(Number(poolData.minPrice) / DECIMAL);
    setMinBidIncrement(Number(poolData.bidIncrement) / DECIMAL);
  };

  const handleAuctionComplete = async () => {
    if (Date.now() > nftInfo.end_date * 1000) {
      setAuctionStatus(2);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (!anchorWallet) return;
        setLoading(true);
        const nftInfoById: any = await getAuctionById(id);
        document.title = `BAD | Raffle | ${nftInfoById?.tokenName}`;
        setFloorPrice(nftInfoById?.floor_price.toString() || "");
        const provider = new anchor.AnchorProvider(connection, anchorWallet, {
          skipPreflight: true,
          preflightCommitment: "confirmed" as Commitment,
        } as ConnectionConfig);

        const program = new anchor.Program(AUCTION.IDL, AUCTION.PROGRAM_ID, provider);
        const auctionId = new anchor.BN(nftInfoById.id);
        const [pool] = await PublicKey.findProgramAddress(
          [
            Buffer.from(AUCTION.POOL_SEED),
            auctionId.toArrayLike(Buffer, "le", 8),
            new PublicKey(nftInfoById.mint).toBuffer(),
          ],
          program.programId
        );

        const ataUser = await getAssociatedTokenAddress(new PublicKey(TokenAddress), anchorWallet?.publicKey);
        const ataInfo: any = await connection.getParsedAccountInfo(ataUser);
        const walletBalance = ataInfo?.value?.data?.parsed?.info?.tokenAmount?.uiAmount;
        if (ataInfo) {
          setBalance(walletBalance);
        }

        const poolData: any = await program.account.pool.fetch(pool);
        if (!poolData) {
          return;
        }

        getAuctionStatus(poolData);
        getUserInfo(poolData?.bids, poolData?.count);

        console.log("min_price", poolData.minPrice.toString());
        console.log("bid_increment", poolData.bidIncrement.toString());
        console.log("count", poolData.count);
        console.log("state", poolData.state);
        // console.log("min_nft_count", poolData.minNftCount);

        poolData.bids.map((item: any) => {
          console.log("bidder", item.bidder.toString());
        });

        const poolData_filteredOwner = poolData?.bids.find(
          (item: any) => item?.bidder?.toString() === anchorWallet?.publicKey?.toString()
        );
        setCurrentBid(Number(poolData_filteredOwner?.price) / DECIMAL);
        // if (poolData_filteredOwner?.claimed === 1) {
        //   setAutionClaimed(true)
        // }
        setInterval(async () => {
          if (anchorWallet) {
            const poolData: any = await program.account.pool.fetch(pool);
            getAuctionStatus(poolData);
          }
        }, 7000);

        startCountdownApi?.start();
        countdownEndApi?.start();
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, [anchorWallet]);

  useEffect(() => {
    (async () => {
      const nftInfoById: any = await getAuctionById(id);

      const startDateFormat = new Date(nftInfoById.start_date * 1000);
      const start_date =
        startDateFormat.getDate() +
        "/" +
        (startDateFormat.getMonth() + 1) +
        "/" +
        startDateFormat.getFullYear() +
        " " +
        startDateFormat.getHours() +
        ":" +
        startDateFormat.getMinutes() +
        ":" +
        startDateFormat.getSeconds();

      const endDateFormat = new Date(nftInfoById.end_date * 1000);
      const end_date =
        endDateFormat.getDate() +
        "/" +
        (endDateFormat.getMonth() + 1) +
        "/" +
        endDateFormat.getFullYear() +
        " " +
        endDateFormat.getHours() +
        ":" +
        endDateFormat.getMinutes() +
        ":" +
        endDateFormat.getSeconds();

      setNftInfo({
        ...nftInfoById,
        start: start_date,
        end: end_date,
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!anchorWallet) return;
        const _ownNfts: any = await VerifyCollection(anchorWallet?.publicKey.toBase58(), connection);
        setOwnNfts(_ownNfts);
      } catch (error) {}
    })();
  }, [anchorWallet]);

  return (
    <>
      {isLoading ? <div id="preloader"></div> : <div id="preloader" style={{ display: "none" }}></div>}
      <div className="bg-black">
        <Navbar />
        <div className="max-w-[1240px] m-auto pt-8 pb-16 px-4">
          <div className="xl:flex justify-between block">
            <div className="xl:basis-[35%] max-w-[450px] m-auto xl:max-w-auto xl:m-0 pb-6 xl:pb-0">
              <div className="rounded-[0.9rem] overflow-hidden border-2 border-pink bg-blackbg transition duration-1000">
                <div className="relative">
                  <img src={nftInfo?.image} alt="BADImage" className="h-[450px] w-full object-cover text-white" />
                  <div className="absolute top-0 left-0 h-full w-full">
                    <div className="flex justify-between items-end h-full p-2">
                      <div className="flex justify-between items-start w-full">
                        {/* <div className="border-black bg-[#949494] border flex rounded-md overflow-hidden">
                          <p className="bg-white text-base pt-[4px] pl-2 pr-3 para-clip-2">
                            <img
                              src={UnionIcons}
                              alt="UnionIcons"
                              className="w-[10px]"
                            />
                          </p>
                          <p className="py-[2px] pl-[2px] pr-[5px] text-[12px] text-white">
                            #0001
                          </p>
                        </div> */}
                        {/* <div className="border-black bg-pink border flex rounded-md overflow-hidden">
                          <p className="bg-white text-[12px] pt-[2px] pl-2 pr-3 para-clip-3">Min NFT Count</p>
                          <p className="py-[2px] pl-[2px] pr-[5px] text-[12px] text-white">
                            {nftInfo.min_nft_count || 1}
                          </p>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    name="solValue"
                    value={amount}
                    min={0}
                    onChange={onChangeSol}
                    className="w-[48%] block text-white text-base text-center outline-none bg-blackbg border border-[#ffffff99] rounded-full py-3 px-5"
                    disabled={auctionStatus !== 1}
                  />
                  <button
                    type="button"
                    className="basis-[48%]  text-white bg-btngrad rounded-full  py-3 sm:px-5"
                    onClick={handleCreateOrUpdateBid}
                  >
                    <span
                      className={` ${
                        auctionStatus === 1 ? "cursor-pointer" : "cursor-no-drop"
                      } max-w-fit mx-[auto] my-0 sm:text-lg text-sm text-white`}
                    >
                      {biddingStatus === 1 ? "Update Bid" : "Create Bid"}
                    </span>
                  </button>
                  {/* { biddingStatus === 1 &&
                  auctionStatus === 2 &&
                  !auctionWinner  && <button
                    type="button"
                    className="basis-[48%]  text-black bg-white rounded-[0.7rem]  py-3 sm:px-5"
                    onClick={handleClaimBid}
                  >
                    <span className={`max-w-fit mx-[auto] my-0 sm:text-lg text-sm text-black ${auctionClaimed ? 'cursor-no-drop' : 'cursor-pointer'}`}>
                      Claim Bid
                    </span>
                  </button>} */}

                  {/* <button
                    type="button"
                    className="text-black bg-white rounded-[0.7rem] flex items-center justify-center py-3 px-5"
                  >
                    <img
                      src={ShareIcon}
                      alt="Pricetag-icon"
                      className="w-[22px]"
                    />
                  </button> */}
                </div>
                <div className="flex items-center justify-between mt-5">
                  {/* { biddingStatus === 1 && <button
                    type="button"
                    className="basis-[48%]  text-black bg-white rounded-[0.7rem]  py-3 sm:px-5"
                    onClick={handleCreateOrUpdateBid}
                  >
                    <span className={` ${auctionStatus === 1 ? 'cursor-pointer' : 'cursor-no-drop'} max-w-fit mx-[auto] my-0 sm:text-lg text-sm text-black`}>
                      {biddingStatus === 1 ? 'Update Bid' : 'Create Bid'}
                    </span>
                  </button>} */}

                  {/* { biddingStatus ===1 && <button
                    type="button"
                    className={`basis-[48%]  text-black bg-white rounded-[0.7rem]  py-3 sm:px-5 ${auctionStatus === 1 ? 'cursor-pointer' : 'cursor-no-drop'}`}
                    onClick={handleDeleteBid}
                  >
                    <span className={` ${auctionStatus === 1 ? 'cursor-pointer' : 'cursor-no-drop'} max-w-fit mx-[auto] my-0 sm:text-lg text-sm text-black`}>
                      Cancel Bid
                    </span>
                  </button>} */}

                  {/* { biddingStatus === 1 &&
                    auctionStatus === 2 &&
                    auctionWinner  && <button
                    type="button"
                    className="basis-[48%]  text-black bg-white rounded-[0.7rem]  py-3 sm:px-5"
                    onClick={handleClaimPrize}
                  >
                    <span className={`max-w-fit mx-[auto] my-0 sm:text-lg text-sm text-black ${auctionClaimPrized ? 'cursor-no-drop' : 'cursor-pointer'}`}>
                      Claim Prize
                    </span>
                  </button>} */}
                </div>
              </div>

              {!anchorWallet && (
                <div className="flex items-cetner justify-center">
                  <WalletMultiButton startIcon={undefined} />
                </div>
              )}
              {anchorWallet && (
                <>
                  {isLoading ? (
                    <></>
                  ) : (
                    <div className="text-center">
                      <p className="text-white text-[1.25rem] mt-3">
                        {/* {biddingStatus === 0 && 'None'} */}
                        {/* {biddingStatus === 1 && auctionStatus === 1 && 'Pending'} */}
                        {/* {
                      biddingStatus === 1 &&
                      auctionStatus === 2 &&
                      auctionWinner &&
                      'Win'
                    }
                    {biddingStatus === 1 &&
                      auctionStatus === 2 &&
                      !auctionWinner &&
                      'Fail'
                    } */}
                      </p>
                      {auctionStatus === 2 && <p className="text-white text-[1.25rem]">Waiting</p>}
                      {auctionStatus === 3 && (
                        <div className="flex items-center justify-between">
                          <div
                            className="text-white"
                            style={{
                              padding: "20px",
                              width: "100%",
                              border: "3px solid orange",
                              borderRadius: "10px",
                            }}
                          >
                            <p className="text-[orange]">Auction Winner!</p>
                            <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>
                              {winnerWalletAddress !== "" &&
                                winnerWalletAddress === anchorWallet?.publicKey.toString() &&
                                `You win!`}
                              {winnerWalletAddress !== "" &&
                                winnerWalletAddress !== anchorWallet?.publicKey.toString() && (
                                  <Link to={`/profile/auction/${winnerWalletAddress}`}>
                                    {winnerWalletAddress.substr(0, 6)}...
                                    {winnerWalletAddress.substr(winnerWalletAddress.length - 4, 4)}
                                  </Link>
                                )}
                              {winnerWalletAddress === "" && `No winner`}
                            </h1>

                            {!auctionClaimPrized && winnerWalletAddress === anchorWallet?.publicKey.toString() && (
                              <div className="btn-gradient rounded-full p-[1px] mb-3">
                                <div className="btn-background-absolute rounded-full">
                                  {
                                    <p
                                      className={`text-[1.25rem] text-center py-2 px-8 block text-[#1a9dfd] m-0
                                  max-w-fit mx-[auto] my-[0]
                                  ${auctionClaimPrized ? "cursor-no-drop" : "cursor-pointer"}
                                  `}
                                      onClick={handleClaimPrize}
                                    >
                                      Claim Prize
                                    </p>
                                  }
                                </div>
                              </div>
                            )}
                            {winnerWalletAddress !== "" && (
                              <p className="text-[orange]">Won with {winnerPrice} ticket(s)</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* { anchorWallet?.publicKey?.toString() === winnerWalletAddress && biddingStatus === 1 && auctionStatus === 2 && auctionWinner && auctionClaimPrized && <p className="text-white text-[1.25rem] mt-3">
                    <span style={{ color: "yellow"}}>Winner:</span>&nbsp;&nbsp;
                    { winnerWalletAddress === '' ? 'No winner': <Link to={`/profile/auction/${winnerWalletAddress}`} style={{ color: "#1a9dfd"}}>{winnerWalletAddress.substr(0, 6)}...{winnerWalletAddress.substr(winnerWalletAddress.length - 4, 4)}</Link>}
                  </p>} */}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="basis-[63%]">
              <div className="bg-blackbg rounded-[0.7rem]">
                <div className="flex justify-between p-4">
                  <div>
                    <div className="flex items-center">
                      <img src={VerificationIcon} alt="VerificationIcon" className="w-[20px]" />
                      &nbsp;
                      <p className="text-white">{nftInfo.collectionName || `Verified Collection`}</p>
                    </div>
                    <h1 className="text-3xl text-white mt-1">{nftInfo.tokenName}</h1>

                    <div className="flex items-center mt-4">
                      <button
                        type="button"
                        className={`${
                          auctionInfo === "auctionInfo"
                            ? "border border-transparent bg-pink text-white py-2 rounded-full sm:px-4 px-2 text-sm sm:text-base"
                            : "text-white"
                        } `}
                        onClick={() => showauctionInfo("auctionInfo")}
                      >
                        Bid Info
                      </button>
                      <button
                        type="button"
                        onClick={() => showauctionInfo("participants")}
                        className={`${
                          auctionInfo === "participants"
                            ? "border border-transparent bg-pink text-white py-2 ml-6 rounded-full sm:px-4 px-2 text-sm sm:text-base"
                            : "text-white ml-6"
                        } `}
                      >
                        Leaderboard
                      </button>
                    </div>
                  </div>
                  <div>
                    <Link to="/auction">
                      <button type="button" className="text-white bg-btngrad rounded-full flex items-center py-3 px-5">
                        <img src={ReturnIcon} alt="ReturnIcon" />
                        <span className="text-white inline-block ml-1">Return</span>
                      </button>
                    </Link>
                    {/* <div className="flex items-center">
                      <img src={ReportIcon} alt="ReportIcon" />
                      <span className="text-[#AA0000] inline-block ml-1">
                        Report
                      </span>
                    </div> */}
                  </div>
                </div>
                <div className="h-[2px] w-[95%] m-auto bg-[#ffffff1e]"></div>
                {auctionInfo === "auctionInfo" && (
                  <>
                    <div className="bg-[#00000031] py-4 px-4 sm:px-0 mt-4">
                      <div className=" relative sm:flex block justify-between sm:w-[85%] m-auto">
                        <div className="text-center translate-x-5">
                          <img src={TimingIcon} alt="TimingIcon" className="max-w-[60px] m-auto" />
                          <p className="text-[#878787]">Time Remaining</p>
                          <p className="text-white">
                            {!!nftInfo?.start_date && (
                              <Countdown
                                ref={setStartCountdownRef}
                                date={nftInfo?.start_date * 1000}
                                // date={1682412607823}
                                zeroPadTime={3}
                                renderer={startCountdownRenderer}
                                onComplete={() => setAuctionStatus(1)}
                              />
                            )}
                          </p>
                        </div>
                        <div
                          className={`
                        absolute left-[50%] translate-x-[-50%]
                        text-center
                        `}
                        >
                          <img src={TicketIcon} alt="TimingIcon" className="max-w-[60px] m-auto" />
                          <p className="text-[#878787]">Min. Bid Amount</p>
                          <p className="text-white">{minBidAmount}</p>
                        </div>
                        <div
                          className="{`
                        md:absolute relative w-[200px] left-[52%] md:translate-x-[63%] translate-x-[0] text-center
                        `}"
                        >
                          <img src={DateIcon} alt="TimingIcon" className="max-w-[60px] m-auto" />
                          <p className="text-[#878787]">Start Date</p>
                          <p className="text-white">{nftInfo.start}</p>
                        </div>
                        <div className="absolute left-[33%] md: border-l-[1px] bg-[transparent] w-2 border-dashed h-[108px] border-white  " />
                        <div className="absolute left-[66%] md: border-l-[1px] bg-[transparent] w-2 border-dashed h-[108px] border-white  " />
                      </div>
                    </div>
                    <div className="bg-[#00000031] py-4 px-4 sm:px-0">
                      <div className="relative sm:flex block justify-between sm:w-[80%] m-auto">
                        <div className="text-center translate-x-5">
                          <img src={TicketIcon} alt="TicketIcon" className="max-w-[60px] m-auto" />
                          <p className="text-[#878787]">Floor Price</p>
                          <p className="text-white">{floorPrice}</p>
                        </div>
                        <div className="text-center translate-x-5 ">
                          <img src={CurrentBidIcon} alt="TimingIcon" className="max-w-[60px] m-auto" />
                          <p className="text-[#878787]">My Bid</p>
                          <p className="text-white">{currentBid ? currentBid : 0}</p>
                        </div>
                        {/* <div className="text-center">
                          <img
                            src={TimingAuctionIcon}
                            alt="TimingIcon"
                            className="max-w-[60px] m-auto"
                          />
                          <p className="text-[#878787]">Time Extension</p>
                          <p className="text-white">5 Minutes</p>
                        </div> */}
                        <div className="text-center">
                          <img src={BidIcon} alt="TimingIcon" className="max-w-[60px] m-auto" />
                          <p className="text-[#878787]">Total Bid count</p>
                          <p className="text-white">{totalBidCount}</p>
                        </div>
                        <div className="absolute left-[31.9%] md: border-l-[1px] bg-[transparent] w-2 border-dashed h-[108px] border-white  " />
                        <div className="absolute left-[67%] md: border-l-[1px] bg-[transparent] w-2 border-dashed h-[108px] border-white  " />
                      </div>
                    </div>
                    <div className="bg-[#00000031] py-4 px-4 sm:px-0">
                      <div className="relative sm:flex block justify-between sm:w-[80%] m-auto">
                        <div className="text-center translate-x-5">
                          <img src={CurrentBidIcon} alt="TimingIcon" className="max-w-[60px] m-auto" />
                          <p className="text-[#878787]">Top Bid</p>
                          <p className="text-white">{topBidAmount}</p>
                        </div>
                        <div className="text-center translate-x-10 ">
                          <img src={TicketIcon} alt="TicketIcon" className="max-w-[60px] m-auto" />
                          <p className="text-[#878787]">&nbsp;&nbsp;Min. Bid Increment</p>
                          <p className="text-white">{minBidIncrement}</p>
                        </div>
                        {/* <div className="text-center">
                          <img
                            src={TimingAuctionIcon}
                            alt="TimingIcon"
                            className="max-w-[60px] m-auto"
                          />
                          <p className="text-[#878787]">Time Extension</p>
                          <p className="text-white">5 Minutes</p>
                        </div> */}
                        <div className="text-center">
                          <img src={BidIcon} alt="TimingIcon" className="max-w-[60px] m-auto" />
                          <p className="text-[#878787]">End Date</p>
                          <p className="text-white">{nftInfo.end}</p>
                        </div>
                        <div className="absolute left-[31.9%] md: border-l-[1px] bg-[transparent] w-2 border-dashed h-[108px] border-white  " />
                        <div className="absolute left-[67%] md: border-l-[1px] bg-[transparent] w-2 border-dashed h-[108px] border-white  " />
                      </div>
                    </div>
                  </>
                )}
                {auctionInfo === "participants" && (
                  <div className="text-white py-4 max-h-[447px] overflow-y-auto" id="wallet-list">
                    <ul className="py-3 px-4 w-full flex justify-between">
                      <li className="basis-[50%] text-xl">Username</li>
                      <li className="basis-[50%] text-xl text-center">Bid Amount</li>
                    </ul>

                    {ticketBuyerLists
                      .sort((a: any, b: any) => b.price - a.price)
                      .map((item: any, idx: any) => {
                        return (
                          <ul className="py-2 px-4 w-full flex justify-between" key={idx}>
                            <li className="basis-[50%] text-base">
                              {item?.name ? (
                                item?.name
                              ) : (
                                <Link to={`/profile/auction/${item?.bidder.toBase58()}`}>
                                  {item?.name
                                    ? item?.name
                                    : item?.bidder.toBase58()?.substr(0, 6) +
                                      "..." +
                                      item?.bidder.toBase58()?.substr(item?.bidder.toBase58().length - 4, 4)}
                                </Link>
                              )}
                              {(item.isWinner === 1 ||
                                (item.isWinner === 0 && idx === 0 && biddingStatus === 1 && auctionStatus === 2)) && (
                                <span style={{ color: "yellow" }}>&nbsp;&nbsp;&nbsp;Winner</span>
                              )}
                            </li>
                            <li className="basis-[50%] text-base text-center">
                              {Number(item?.price) / CONFIG.DECIMAL}
                            </li>
                          </ul>
                        );
                      })}
                  </div>
                )}
                <div className="p-4">
                  <h1 className="text-2xl text-white">Terms & Conditions</h1>
                  <div className="text-white mt-2 text-base list-decimal px-5">
                    <pre>
                      <p
                        style={{
                          whiteSpace: "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {nftInfo.description}
                      </p>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default DetailUserAuction;
