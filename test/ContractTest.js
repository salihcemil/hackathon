const { inputToConfig } = require('@ethereum-waffle/compiler');
const { expect } = require('chai');
const { arrayify } = require('ethers/lib/utils');
const { ethers } = require('hardhat');
const { BigNumber } = require('ethers');

describe('Contract', () => {
    let [owner, user1, user2, user3] = [];
    let Contract;
    let sampleContract;

    beforeEach(async () => {
        [owner, user1, user2, user3] = await ethers.getSigners();
        Contract = await ethers.getContractFactory("Contract");
        sampleContract= await Contract.deploy("hacko");
    });

    it('Should be deployed correctly', async function () {
        const name = await sampleContract.getName();
        expect(name).to.equal('hacko');
    });

    it('Should start with empty mapping', async function () {
        const element = await sampleContract.getTransactionById(0);
        expect(element.amountInWei).to.equal(ethers.utils.parseEther("0"));
    });

    it('Should emit correct event on create record', async function () {
        await expect(
                sampleContract.createRecord(0, 
                    user1.address, 
                    user2.address, 
                    500, 100)).to.emit(sampleContract, 'Recorded').withArgs(
                        0, 
                        user1.address, 
                        user2.address, 
                        500, 100
                    );
    });

    it('Should create record succesfully', async function () {
        await sampleContract.createRecord(0, 
                    user1.address, 
                    user2.address, 
                    500, 100);
        var tr = await sampleContract.getTransactionById(0);
        expect(BigNumber.from(tr.amountInWei)).to.be.equal(500);
    })

    it('Should revert with onlyOwner error', async function () {
        await expect(sampleContract.connect(user3).createRecord(0, 
                    user1.address, 
                    user2.address, 
                    500, 100)).to.be.revertedWith('Ownable: caller is not the owner');
    })


    //should fail at creating record
    it('Should revert with already exists error', async function () {
        await sampleContract.createRecord(0, 
                    user1.address, 
                    user2.address,                          
                    500, 100);

        await expect(sampleContract.createRecord(0, 
                    user1.address, 
                    user2.address, 
            500, 100)).to.be.revertedWith('Record already has been created');
    })

    it('Should revert with zero address error', async function () {
        await expect(sampleContract.createRecord(0, 
                    user1.address, 
                    '0x0000000000000000000000000000000000000000', 
            500, 100)).to.be.revertedWith('Sender or receiver cannot be zero address');
    })

    it('Should revert with same addresses error', async function () {
        await expect(sampleContract.createRecord(0, 
                    user1.address, 
                    user1.address, 
            500, 100)).to.be.revertedWith('Sender and receiver must be different addresses');
    })

    it('Should revert with zero fund error', async function () {
        await expect(sampleContract.createRecord(0, 
                    user1.address, 
                    user2.address, 
            0, 100)).to.be.revertedWith('Amount cannot be zero');
    })

    it('Should revert with zero fiat value error', async function () {
        await expect(sampleContract.createRecord(0, 
                    user1.address, 
                    user2.address, 
            500, 0)).to.be.revertedWith('Fiat value cannot be zero');
    })

    it('Should lock fund succesfully', async function () {
        await sampleContract.createRecord(0, 
                    user1.address, 
                    user2.address, 
            500, 100);
        
        await expect(sampleContract.connect(user1).lockFund(0, {
                        value: 500
                    })).to.emit(sampleContract, 'Locked').withArgs(0, 500);
        
    })

    it('Should revert with record not found', async function () {
        await expect(sampleContract.connect(user1).lockFund(0, {
                        value: 500
                    })).to.be.revertedWith('Record not found');
        
    })

    it('Should revert with invalid sender', async function () {
        await sampleContract.createRecord(0, 
                    user1.address, 
                    user2.address, 
            500, 100);

        await expect(sampleContract.connect(user2).lockFund(0, {
                        value: 500
                    })).to.be.revertedWith('Invalid sender');
        
    })

    
    it('Should revert with invalid amount', async function () {
        await sampleContract.createRecord(0, 
                    user1.address, 
                    user2.address, 
            500, 100);

        await expect(sampleContract.connect(user1).lockFund(0, {
                        value: 499
                    })).to.be.revertedWith('Invalid amount');
        
    })

    it('Should revert with fund has already been locked', async function () {
        await sampleContract.createRecord(0, 
                    user1.address, 
                    user2.address, 
            500, 100);

        await sampleContract.connect(user1).lockFund(0, {
                value: 500
            })
        await expect(sampleContract.connect(user1).lockFund(0, {
            value: 500
            })).to.be.revertedWith('Fund has already been locked');
    })

    //should revert with contract caller

    it('Should lock fund succesfully', async function () {
        await sampleContract.createRecord(0, 
            user1.address, 
            user2.address, 
            500, 100);
        
        await sampleContract.connect(user1).lockFund(0, {
                        value: 500
                    });
        
        await expect(sampleContract.connect(owner)
            .releaseFund(0))
            .to.emit(sampleContract, 'Released')
                .withArgs(0, user1.address, user2.address, 500, 100);
    })

    it('Should revert with record not found', async function () {
        await sampleContract.createRecord(0, 
            user1.address, 
            user2.address, 
            500, 100);
        
        await sampleContract.connect(user1).lockFund(0, {
                        value: 500
                    });
        
        await expect(sampleContract.connect(owner)
            .releaseFund(1))
                .to.be.revertedWith('Record not found');
    })

    it('Should revert with error in transaction status', async function () {
        await sampleContract.createRecord(0, 
            user1.address, 
            user2.address, 
            500, 100);
        
        await expect(sampleContract.connect(owner)
            .releaseFund(0))
                .to.be.revertedWith('Error in transaction status');
    })

    it('Should revert with OnlyOwner error', async function () {
        await sampleContract.createRecord(0, 
            user1.address, 
            user2.address, 
            500, 100);
        
        await expect(sampleContract.connect(user3)
            .releaseFund(0))
                .to.be.revertedWith('Ownable: caller is not the owner');
    })

});