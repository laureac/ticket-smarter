import React, { useEffect } from "react";
import { ethers } from "ethers";

const Account = ({
  setAccount,
  account,
  provider,
  setProvider,
  config,
  TicketSmarterAbi,
  setTicketSmarter,
}) => {
  const requestAccount = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const ticketSmarter = new ethers.Contract(
      config[network.chainId].TicketSmarter.address,
      TicketSmarterAbi,
      provider
    );
    setTicketSmarter(ticketSmarter);

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = ethers.getAddress(accounts[0]);
        setAccount(account);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      {account}
      <button onClick={requestAccount}>Connect</button>
    </div>
  );
};

export default Account;
