import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import CONFIG from "../../config";
import {
  setFeeForRaffle,
  getFeeForRaffle
} from "../../services/contracts/raffle";
import {
  setFeeForAuction,
  getFeeForAuction,
} from "../../services/contracts/auction";
import { ToastContainer, toast } from "react-toastify";

const { ADMIN_WALLET } = CONFIG;

const Fees = () => {
  const navigate = useNavigate();
  const anchorWallet: any = useAnchorWallet();
  const { connection } = useConnection();

  const [isLoading, setLoading] = useState(false);
  const [fee1, setFee1] = useState<number>(0);
  const [fee2, setFee2] = useState<number>(0);
  const [fee3, setFee3] = useState<number>(0);

  const [fee4, setFee4] = useState<number>(0);
  const [fee5, setFee5] = useState<number>(0);
  const [fee6, setFee6] = useState<number>(0);
  

  const getData = async () => {
    if (anchorWallet?.publicKey.toString() !== ADMIN_WALLET) {
      navigate("/");
      return;
    }

    getFeeForAuction(anchorWallet).then((data: any)=>{
      if(data.success){
        setFee1(data?.data?.createFee)
        setFee2(data?.data?.claimFee)
        setFee3(data?.data?.ticketFee)
      }
    })
    getFeeForRaffle(anchorWallet).then((data: any)=>{
      if(data.success){
        setFee4(data?.data?.createFee)
        setFee5(data?.data?.claimFee)
        setFee6(data?.data?.ticketFee)
      }
    })
  }
  
  const raffleFeeHandle = async () => {
    if (fee4 < 0 || fee5 < 0 || fee6 < 0) {
      toast.error(`Please increase the fee`);
      return;
    }

		const id = toast.loading("Setting fee...")

    const res = await setFeeForRaffle(anchorWallet, fee4, fee5, fee6);
    if(res){
      toast.update(id, { render: "Successfully set", type: "success", isLoading: false, autoClose: 2000, closeButton: true });
    }else {
      toast.update(id, { render: "Got Error", type: "error", isLoading: false, autoClose: 2000, closeButton: true });
    }
  }
  
  const auctionFeeHandle = async () => {
    if (fee1 < 0 || fee2 < 0 || fee3 < 0) {
      toast.error(`Please increase the fee`);
      return;
    }

		const id = toast.loading("Setting fee...")
    const res = await setFeeForAuction(anchorWallet, fee1, fee2, fee3);
    if(res){
      toast.update(id, { render: "Successfully set", type: "success", isLoading: false, autoClose: 2000, closeButton: true });
    }else {
      toast.update(id, { render: "Got Error", type: "error", isLoading: false, autoClose: 2000, closeButton: true });
    }

  }
 


  useEffect(() => {
    if(anchorWallet?.publicKey){
      getData();
    }
  }, [anchorWallet])


  return (
    <div>
      {isLoading ? <div id="preloader"></div> : <div id="preloader" style={{ display: "none" }}></div>}
      <div className="bg-black">
        <Navbar />
        <div className="max-w-[768px] m-auto pt-0 pb-16 px-4 md:px-0">
          <h1 className="text-white text-4xl">Raffle Fees</h1>
          <div className="border-1 mt-6 md:px-8 px-4 pt-8 pb-14 border-[#33333A] bg-[#17141c] rounded-[0.7rem]">
            <div className="mb-5">
              <label className="font-cm text-white text-lg inline-block mb-1">Raffle create fee</label>
              <div className="relative border border-[#ffffff99] rounded-full overflow-hidden">
                <input
                  type="number"
                  id="text-1"
                  name="text-1"
                  value={fee4}
                  onChange={(e: any)=>setFee4(e.target.value)}
                  className="font-cr bg-transparent w-full text-[#fff] placeholder:text-[#606060] px-4 py-3 outline-none"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="font-cm text-white text-lg inline-block mb-1">Raffle claim fee</label>
              <div className="relative border border-[#ffffff99] rounded-full overflow-hidden">
                <input
                  type="number"
                  id="text-2"
                  name="text-2"
                  value={fee5}
                  onChange={(e: any)=>setFee5(e.target.value)}
                  className="font-cr bg-transparent w-full text-[#fff] placeholder:text-[#606060] px-4 py-3 outline-none"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="font-cm text-white text-lg inline-block mb-1">Raffle per ticket fee</label>
              <div className="relative border border-[#ffffff99] rounded-full overflow-hidden">
                <input
                  type="number"
                  id="text-3"
                  name="text-3"
                  value={fee6}
                  onChange={(e: any)=>setFee6(e.target.value)}
                  className="font-cr bg-transparent w-full text-[#fff] placeholder:text-[#606060] px-4 py-3 outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center -mt-7">
            <button className="font-cr text-lg cursor-pointer bg-btngrad text-white rounded-full flex items-center py-[10px] px-10" onClick={raffleFeeHandle}>
              Save
            </button>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Fees;
