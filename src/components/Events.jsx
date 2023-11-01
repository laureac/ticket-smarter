import React from "react";
import { ethers } from "ethers";

const Events = ({ occasion, setOccasion }) => {
  const normalisedOccasion = {
    name: occasion[1],
    day: occasion[2],
    time: occasion[3],
    location: occasion[4],
    price: ethers.formatUnits(occasion[5].toString(), "ether"),
    tickets: occasion[7].toString(),
  };

  return (
    <div className="flex w-full border-b py-5">
      <div className="flex flex-col w-2/12 ">
        <p className="font-bold text-xl">{normalisedOccasion.day}</p>
      </div>
      <div className="w-6/12">
        <p className="font-small text-slate-500">{normalisedOccasion.time}</p>
        <h3 className="font-bold">{normalisedOccasion.name}</h3>
        <p className="font-small text-slate-500">
          {normalisedOccasion.location}
        </p>
      </div>
      <p className="w-2/12">
        <span className="font-bold">{normalisedOccasion.price} </span>
        ETH
      </p>
      <div className="w-2/12 flex">
        {normalisedOccasion.tickets === "0" ? (
          <button type="button" className="btn-blue btn my-auto" disabled>
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-blue my-auto"
            onClick={() => setOccasion(occasion)}
          >
            View Seats
          </button>
        )}
      </div>
    </div>
  );
};

export default Events;
