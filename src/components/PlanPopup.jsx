import React from "react";

const PlanPopup = ({ occasion, ticketSmarter, provider, setOccasion }) => {
  return (
    <div className="absolute bg-white border translate-y-1/2 translate-x-1/2 left-1/2 top-1/2 z-10 p-4">
      <div className="relative">
        <button
          onClick={() => setOccasion(null)}
          className="absolute top-1 right-1"
        >
          X
        </button>
        PlanPopup
      </div>
    </div>
  );
};

export default PlanPopup;
