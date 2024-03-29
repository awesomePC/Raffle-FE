import React from "react";
import { Link, useLocation } from "react-router-dom";
import AddRaffleIcon from "../assets/add-raffle-icon.png";

const Menus: React.FC = () => {
  const activeLink = useLocation();
  return (
    <div className="sm:px-4 px-2">
      {activeLink.pathname === "/" ||
      activeLink.pathname === "/auction" ||
      activeLink.pathname === "/admin" ||
      activeLink.pathname === "/admin/auction" ||
      activeLink.pathname === "/profile" ||
      activeLink.pathname === "/participant" ||
      activeLink.pathname === "/filter-auctions" ? (
        <div className="sm:mt-12 mt-8 flex justify-end max-w-[1280px] m-auto">
          <div className="flex justify-between items-center max-w-3xl w-full">
            <div className="w-[300px] bg-blackbg rounded-full p-1">
              <div className="rounded-full">
                <div className="flex items-center justify-between text-white text-base">
                  <Link
                    to={
                      activeLink.pathname === "/" ||
                      activeLink.pathname === "/auction" ||
                      activeLink.pathname === "/participant" ||
                      activeLink.pathname === "/profile"
                        ? "/"
                        : "/admin"
                    }
                    className={`${
                      activeLink.pathname === "/" ||
                      activeLink.pathname === "/profile" ||
                      activeLink.pathname === "/participant" ||
                      activeLink.pathname === "/admin"
                        ? " transition duration-75 btn-background basis-[49%] text-center py-3 rounded-full bg-btngrad"
                        : "duration-75 transition basis-[49%] text-center text-white py-3 rounded-[0.7rem]"
                    }`}
                  >
                    Raffles
                  </Link>
                </div>
              </div>
            </div>
            <div>
              {activeLink.pathname === "/admin" && (
                <div className="flex">
                  <Link
                    to="/admin/raffle/create"
                    className="bg-btngrad flex items-center py-3 px-5 rounded-full text-white ml-4"
                  >
                    <img src={AddRaffleIcon} alt="RBI" className="mr-2" />

                    <span>New Raffle</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Menus;
