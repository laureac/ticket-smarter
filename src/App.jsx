import "./App.css";
import { ethers } from "ethers";

// ABIs
import TicketSmarterAbi from "./abi/TicketSmarter.json";

// Config
import config from "./config.json";
import { useEffect, useState } from "react";
import Account from "./components/Account";

function App() {
  //State setters
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [ticketSmarter, setTicketSmarter] = useState(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="App">
      <Account
        setAccount={setAccount}
        account={account}
        setProvider={setProvider}
        config={config}
        TicketSmarterAbi={TicketSmarterAbi}
        setTicketSmarter={setTicketSmarter}
        provider={provider}
      />
    </div>
  );
}

export default App;
