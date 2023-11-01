import "./App.css";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Events from "./components/Events";
import PlanPopup from "./components/PlanPopup";
import TicketSmarterAbi from "./abi/TicketSmarter.json";
import config from "./config.json";

function App() {
  //State setters
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [ticketSmarter, setTicketSmarter] = useState(null);
  const [occasions, setOccasions] = useState([]);
  const [occasion, setOccasion] = useState(null);

  const requestAccount = useCallback(async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const ticketSmarter = new ethers.Contract(
      config[network.chainId].TicketSmarter.address,
      TicketSmarterAbi,
      provider
    );

    setTicketSmarter(ticketSmarter);

    if (ticketSmarter === undefined) return;
    const totalOccasions = await ticketSmarter.totalOccasions();

    const occasions = [];

    for (var i = 1; i <= totalOccasions; i++) {
      const occasion = await ticketSmarter.getOccasion(i);
      occasions.push(occasion);
    }

    setOccasions(occasions);

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
  }, [setProvider, setAccount, setTicketSmarter]);

  useEffect(() => {
    requestAccount();
    window.ethereum.on("accountsChanged", async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = ethers.getAddress(accounts[0]);
        setAccount(account);
      } catch (error) {
        console.log(error);
      }
    });
  }, [requestAccount, setAccount]);

  return (
    <div className="App">
      <Navigation
        setAccount={setAccount}
        account={account}
        setProvider={setProvider}
        config={config}
        TicketSmarterAbi={TicketSmarterAbi}
        setTicketSmarter={setTicketSmarter}
        provider={provider}
      />
      <div className="container flex flex-col my-10 max-w-5xl">
        <h1 className="font-bold text-blue-700 text-4xl py-4">Events</h1>
        {occasions.map((occasion, index) => (
          <Events occasion={occasion} index={index} setOccasion={setOccasion} />
        ))}
        {occasion && (
          <PlanPopup
            occasion={occasion}
            ticketSmarter={ticketSmarter}
            provider={provider}
            setOccasion={setOccasion}
          />
        )}
      </div>
    </div>
  );
}

export default App;
