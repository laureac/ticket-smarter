// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// async function main() {
//   const currentTimestampInSeconds = Math.round(day.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = hre.ethers.parseEther("0.001");

//   const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   await lock.waitForDeployment();

//   console.log(
//     `Lock with ${ethers.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners();
  const NAME = "TicketSmarter";
  const SYMBOL = "TS";

  // Deploy contract
  const TicketSmarter = await ethers.getContractFactory("TicketSmarter");
  const ticketSmarter = await TicketSmarter.deploy(NAME, SYMBOL);
  await ticketSmarter.waitForDeployment();

  // Get the ABI of the contract
  const abi = ticketSmarter.interface.format("json");
  console.log("ABI:", abi);

  console.log(`Deployed TicketSmarter Contract at: ${ticketSmarter.target}\n`);

  // List 6 events
  const occasions = [
    {
      name: "UFC Miami",
      price: tokens(3),
      tickets: 0,
      day: "May 31",
      time: "6:00PM EST",
      location: "Miami-Dade Arena - Miami, FL",
    },
    {
      name: "ETH Tokyo",
      price: tokens(1),
      tickets: 125,
      day: "Jun 2",
      time: "1:00PM JST",
      location: "Tokyo, Japan",
    },
    {
      name: "ETH Privacy Hackathon",
      price: tokens(0.25),
      tickets: 200,
      day: "Jun 9",
      time: "10:00AM TRT",
      location: "Turkey, Istanbul",
    },
    {
      name: "Dallas Mavericks vs. San Antonio Spurs",
      price: tokens(5),
      tickets: 0,
      day: "Jun 11",
      time: "2:30PM CST",
      location: "American Airlines Center - Dallas, TX",
    },
    {
      name: "ETH Global Toronto",
      price: tokens(1.5),
      tickets: 125,
      day: "Jun 23",
      time: "11:00AM EST",
      location: "Toronto, Canada",
    },
  ];

  for (var i = 0; i < 5; i++) {
    const transaction = await ticketSmarter
      .connect(deployer)
      .list(
        occasions[i].name,
        occasions[i].day,
        occasions[i].time,
        occasions[i].location,
        occasions[i].price,
        occasions[i].tickets
      );

    await transaction.wait();

    console.log(`Listed Event ${i + 1}: ${occasions[i].name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
