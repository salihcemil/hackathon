const { ethers } = require('hardhat');
const express = require('express');
const cors = require('cors');
const app = express();
const denv = require('dotenv').config();

app.use(express.json());
app.use(cors());

const contractABI = require("../artifacts/contracts/Contract.sol/Contract.json");

const provider = new ethers.providers.AlchemyProvider("rinkeby", process.env.API_KEY);//ethers.providers.JsonRpcProvider(process.env.RINKEBY_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI.abi, signer);

app.post('/api/createRecord/', async (req, res) => {
    const paymentId = req.body.paymentId;
    const senderAddress = req.body.sender;
    const receiverAddress = req.body.receiver;
    const wei = req.body.amountInWei;
    const fiat = req.body.fiat;
    contract.createRecord(paymentId, senderAddress, receiverAddress, wei, fiat);
    res.send("ok");
});

app.post('/api/lockFund/', async (req, res) => {
    const paymentId = req.body.paymentId;
    contract.lockFund(paymentId);
    res.send("ok");
});

app.post('/api/releaseFund/', async (req, res) => {
    const paymentId = req.body.paymentId;
    const result = await contract.releaseFund(paymentId);
    res.send("ok");
});

app.post('/api/fundPayback/', async (req, res) => {
    res.send('Not implemented yet');
});

app.get('/', (req, res) => {
    res.send('This is a test API');
});

const port = 3010;
app.listen(port, () => console.log(`Listening on port ${port}`));


const listenToEvents = () => {

    contract.on('Recorded', async (_paymentId, _sender, _receiver, _amountInWei, _fiat) => {
        console.log(`Transaction has been recorded with 
            paymentId: ${_paymentId}
            sender: ${_sender}
            receiver: ${_receiver}
            amountInWei ${_amountInWei}
            fiat: ${_fiat}`);

    });

    contract.on('Locked', async (_paymentId, _amountInWei) => {
        console.log(`
            Fund has been locked with
            paymentId: ${_paymentId}
            amountInWei ${_amountInWei}`);
    });

    contract.on('Released', async (_paymentId, _sender, _receiver, _amountInWei, _fiat) => {
        console.log(`Fund has been released with 
            paymentId: ${_paymentId}
            sender: ${_sender}
            receiver: ${_receiver}
            amountInWei ${_amountInWei}
            fiat: ${_fiat}`);

    });
}
listenToEvents();