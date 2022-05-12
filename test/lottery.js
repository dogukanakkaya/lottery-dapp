const Lottery = artifacts.require('Lottery');
const VRFCoordinatorV2Mock = artifacts.require('VRFCoordinatorV2Mock');

contract('Lottery', accounts => {
    let lottery;
    let vrfCoordinatorV2Mock;

    before(async () => {
        lottery = await Lottery.deployed();
        vrfCoordinatorV2Mock = await VRFCoordinatorV2Mock.deployed();
    })

    it('should return start(0) state', async () => {
        await lottery.start();

        const state = await lottery.getState();
        assert.equal(state.toNumber(), 0);
    });

    it('should add new player', async () => {
        const playerTransactions = [
            await lottery.enter("dogukan", { from: accounts[0], value: web3.utils.toWei('0.001', 'ether') }),
            await lottery.enter("nobody", { from: accounts[0], value: web3.utils.toWei('0.001', 'ether') })
        ];

        assert.isTrue(playerTransactions.every(tx => tx.receipt.status))
    });

    // todo: vrf mock not working, fix it
    it('should calculate winner', async () => {
        await vrfCoordinatorV2Mock.createSubscription();
        const calculateWinner = await lottery.calculateWinner();

        console.log(calculateWinner);
    });
});
