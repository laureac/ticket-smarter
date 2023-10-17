const { expect } = require("chai");

const NAME = "TicketSmarter";
const SYMBOL = "TS";

// Set variables for Occasion
const OCCASION_NAME = "ETH Texas";
const OCCASION_COST = ethers.parseUnits("1", "ether");
const OCCASION_MAX_TICKETS = 100;
const OCCASION_DATE = "Apr 27";
const OCCASION_TIME = "10:00 AM";
const OCCASION_LOCATION = "Austin, Texas";

describe("TicketSmarter", () => {
  let ticketSmarter;
  let ownerSigner, buyerSigner;

  beforeEach(async () => {
    /* Get users */
    [ownerSigner, buyerSigner] = await ethers.getSigners();

    /* deploy the contract */
    const TicketSmarter = await ethers.getContractFactory("TicketSmarter");
    ticketSmarter = await TicketSmarter.deploy(NAME, SYMBOL);

    const transaction = await ticketSmarter
      .connect(ownerSigner)
      .list(
        OCCASION_NAME,
        OCCASION_DATE,
        OCCASION_TIME,
        OCCASION_LOCATION,
        OCCASION_COST,
        OCCASION_MAX_TICKETS
      );

    await transaction.wait();
  });

  describe("Deployement", () => {
    it("Set the name", async () => {
      expect(await ticketSmarter.name()).to.equal(NAME);
    });

    it("Set the symbol", async () => {
      expect(await ticketSmarter.symbol()).to.equal(SYMBOL);
    });

    it("Set the owner", async () => {
      expect(await ticketSmarter.owner()).to.equal(ownerSigner.address);
    });
  });

  describe("Occasion", () => {
    it("Returns occasions attributes", async () => {
      const occasion = await ticketSmarter.getOccasion(1);
      expect(occasion.id).to.be.equal(1);
      expect(occasion.name).to.be.equal(OCCASION_NAME);
      expect(occasion.price).to.be.equal(OCCASION_COST);
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS);
      expect(occasion.day).to.be.equal(OCCASION_DATE);
      expect(occasion.time).to.be.equal(OCCASION_TIME);
      expect(occasion.location).to.be.equal(OCCASION_LOCATION);
    });

    it("Updates occasions count", async () => {
      const totalOccasions = await ticketSmarter.totalOccasions();
      expect(totalOccasions).to.be.equal(1);
    });
  });

  describe("Minting", () => {
    const ID = 1;
    const SEAT = 10;
    const AMOUNT = ethers.parseUnits("1", "ether");

    beforeEach(async () => {
      const transaction = await ticketSmarter
        .connect(buyerSigner)
        .mintTicket(ID, SEAT, { value: AMOUNT });
      transaction.wait();
    });

    it("Update occasions count", async () => {
      const occasion = await ticketSmarter.getOccasion(ID);
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS - 1);
    });

    it("Update buying status", async () => {
      const status = await ticketSmarter.hasBought(ID, buyerSigner.address);
      expect(status).to.be.equal(true);
    });

    it("Update buying seat", async () => {
      const owner = await ticketSmarter.seatTaken(ID, SEAT);
      expect(owner).to.be.equal(buyerSigner.address);
    });

    it("Update overall seats status", async () => {
      const seatsTaken = await ticketSmarter.getSeatsTaken(ID);
      expect(seatsTaken.length).to.be.equal(1);
      expect(seatsTaken[0]).to.be.equal(SEAT);
    });

    it("Updates the contract balance", async () => {
      const balance = await ethers.provider.getBalance(ticketSmarter.target);
      expect(balance).to.be.equal(AMOUNT);
    });
  });

  describe("Withdrawing", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.parseUnits("1", "ether");
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(ownerSigner.address);

      let transaction = await ticketSmarter
        .connect(buyerSigner)
        .mintTicket(ID, SEAT, { value: AMOUNT });
      await transaction.wait();

      transaction = await ticketSmarter.connect(ownerSigner).withdraw();
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(
        ownerSigner.address
      );
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
  });
});
