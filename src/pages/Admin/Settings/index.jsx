import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { addAdminForAuction, removeAdminForAuction, getAdminsForAuction } from "../../../services/contracts/auction";
import { addAdminForRaffle, removeAdminForRaffle, getAdminsForRaffle } from "../../../services/contracts/raffle";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import CONFIG from "../../../config";
import { ToastContainer, toast } from "react-toastify";

const { ADMIN_WALLET } = CONFIG;

const Settings = () => {
  const navigate = useNavigate();
  const anchorWallet = useAnchorWallet();
  const [isLoading, setLoading] = useState(false);
  const [openModal, setopenModal] = useState(false);
  const [openNewModal, setopenNewModal] = useState(false);
  const [adminWallet, setAdminWallet] = useState();
  const [activeTab, setactiveTab] = useState("auction");
  const [auctionAdmins, setAuctionAdmins] = useState([]);
  const [raffleAdmins, setRaffleAdmins] = useState([]);

  useEffect(() => {
    if (anchorWallet?.publicKey) {
      getData();
    }
  }, [anchorWallet]);

  const getData = async () => {
    // if (anchorWallet?.publicKey.toString() !== ADMIN_WALLET) {
    //   navigate("/");
    //   return;
    // }
    getAdminsForAuction(anchorWallet).then((data) => {
      console.log("getAdminsForAuction data: ", data);
      if(data.success){
        const temp = [];
        for(let i = 0; i < data.data.admins.length; i++) {
          if(data.data.admins[i].toBase58() != "11111111111111111111111111111111")   temp.push(data.data.admins[i].toBase58())
        }
        setAuctionAdmins(temp)
      }
    });
    getAdminsForRaffle(anchorWallet).then((data) => {
      console.log("getAdminsForRaffle data: ", data);
      if(data.success){
        const temp = [];
        for(let i = 0; i < data.data.admins.length; i++) {
          if(data.data.admins[i].toBase58() != "11111111111111111111111111111111")   temp.push(data.data.admins[i].toBase58())
        }
        setRaffleAdmins(temp)
      }
    });
  };

  const addAdminHandle = async () => {
    if (!adminWallet) {
      toast.error(`Please input the wallet`);
      return;
    }

    const id = toast.loading("Adding admin...");
    let res;
    if(activeTab === "auction") {
      res = await addAdminForAuction(anchorWallet, adminWallet);
    } else {
      res = await addAdminForRaffle(anchorWallet, adminWallet);
    }
    if(res){
      toast.update(id, {
        render: "Successfully added",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
    } else {
      toast.update(id, { render: "Got Error", type: "error", isLoading: false, autoClose: 2000, closeButton: true });
    }
  };

  const removeAdminHandle = async (admin) => {
    const id = toast.loading("Removing admin...");

    let res;
    if(activeTab === "auction") {
      res = await removeAdminForAuction(anchorWallet, admin);
    }else{
      res = await removeAdminForRaffle(anchorWallet, admin);
    }

    if(res) {
      toast.update(id, {
        render: "Successfully removed",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
    }else {
      toast.update(id, { render: "Got Error", type: "error", isLoading: false, autoClose: 2000, closeButton: true });
    }
  };

  return (
    <div>
      {isLoading ? <div id="preloader"></div> : <div id="preloader" style={{ display: "none" }}></div>}
      <div className="bg-black">
        <Navbar />
        <div className="max-w-[768px] m-auto pt-20 pb-16 px-4 md:px-0">
          <h1 className="text-center text-white text-4xl font-cb">Admin Settings</h1>

          {/* TABS  */}
          <div className="flex justify-center items-center max-w-3xl w-full py-10">
            <div className="w-[300px] bg-blackbg rounded-full p-1">
              <div className="rounded-full">
                <div className="flex items-center justify-between text-white text-base">
                  <button
                    className={`${
                      activeTab === "raffle"
                        ? " transition duration-75 btn-background basis-[49%] text-center py-3 rounded-full bg-btngrad"
                        : "duration-75 transition basis-[49%] text-center text-white py-3 rounded-[0.7rem]"
                    }`}
                    onClick={() => setactiveTab("raffle")}
                  >
                    Raffles
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ENd  TABS  */}

          {/* Aucion Address  */}
          {activeTab === "auction" && (
            <>
              <div className="flex items-center justify-start">
                <button className="bg-btngrad  text-white py-3 px-6 rounded-full" onClick={() => setopenNewModal(true)}>
                  Add New Address
                </button>
              </div>
              {auctionAdmins?.map((item, index)=> (
                <div key={index} className="border-1 mt-6 md:px-8 px-4 p-6 border-[#33333A] bg-blackbg rounded-[0.7rem]">
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <input
                        type="text"
                        disabled
                        value={item}
                        className="w-full bg-blackbg text-white"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between space-x-4">
                        <button
                          type="button"
                          onClick={(e)=>removeAdminHandle(item)}
                          className="rounded-full text-pink bg-transparent w-28  py-3 border border-pink"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
            </>
          )}
          {/* ENd Aucion Address  */}

          {/* ENd Raffle Address  */}
          {activeTab === "raffle" && (
            <>
              <div className="flex items-center justify-start">
                <button className="bg-btngrad  text-white py-3 px-6 rounded-full" onClick={() => setopenNewModal(true)}>
                  Add New Address
                </button>
              </div>
              {raffleAdmins?.map((item, index)=> (
                <div key={index} className="border-1 mt-6 md:px-8 px-4 p-6 border-[#33333A] bg-blackbg rounded-[0.7rem]">
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <input
                        type="text"
                        disabled
                        value={item}
                        className="w-full bg-blackbg text-white"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between space-x-4">
                        <button
                          type="button"
                          onClick={(e)=>removeAdminHandle(item)}
                          className="rounded-full text-pink bg-transparent w-28  py-3 border border-pink"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          {/* ENd Raffle Address  */}
        </div>
      </div>

      {/* Edit Modal  */}
      {openModal && (
        <div className="fixed w-full h-full top-0 left-0 custom-blur-bg flex items-center justify-center z-50 px-2 py-12 overflow-y-auto">
          <div className="w-full max-w-xl m-auto border md:px-8 px-4 md:py-8 py-4 border-pink bg-blackbg rounded-[0.7rem]">
            <div className="flex items-center justify-between">
              <h1 className="text-white md:text-3xl text-xl font-cb">Edit Address</h1>
              <button
                className="bg-btngrad text-xl rounded-full py-1 px-3 font-bold text-white"
                onClick={() => setopenModal(false)}
              >
                X
              </button>
            </div>
            <div className="mt-6">
              <input
                type="text"
                value={"132183i1pjebydoiqwgd812vdbb9176862e612"}
                className="border border-pink/50 bg-black/20 w-full px-4 py-3 rounded-full text-white md:text-center"
              />
            </div>
            <div className="flex item-center justify-center mt-6">
              <button className="bg-btngrad  text-white py-2 px-6 rounded-full">Save</button>
              <button
                className="bg-transparent border border-pink ml-4 py-2 px-6 rounded-full text-pink"
                onClick={() => setopenModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* End Edit Modal  */}
      {/* New Address Modal  */}
      {openNewModal && (
        <div className="fixed w-full h-full top-0 left-0 custom-blur-bg flex items-center justify-center z-50 px-2 py-12 overflow-y-auto">
          <div className="w-full max-w-xl m-auto border md:px-8 px-4 md:py-8 py-4 border-pink bg-blackbg rounded-[0.7rem]">
            <div className="flex items-center justify-between">
              <h1 className="text-white md:text-3xl text-xl font-cb">Add Address</h1>
              <button
                className="bg-btngrad text-xl rounded-full py-1 px-3 font-bold text-white"
                onClick={() => setopenNewModal(false)}
              >
                X
              </button>
            </div>
            <div className="mt-6">
              <input
                type="text"
                placeholder="Enter Your Address"
                onChange={(e) => setAdminWallet(e.target.value)}
                className="border border-pink/50 bg-black/20 w-full px-4 py-3 rounded-full text-white md:text-center placeholder:text-white/20"
              />
            </div>
            <div className="flex item-center justify-center mt-6">
              <button
                className="bg-btngrad  text-white py-2 px-6 rounded-full"
                onClick={() => {
                  addAdminHandle();
                }}
              >
                Save
              </button>
              <button
                className="bg-transparent border border-pink ml-4 py-2 px-6 rounded-full text-pink"
                onClick={() => setopenNewModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
      {/* End New Modal  */}
    </div>
  );
};

export default Settings;
