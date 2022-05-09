const Lottery = artifacts.require('Lottery');

contract('Lottery', accounts => {
    it('should return start(0) state', async () => {
        const lottery = await Lottery.deployed();
        await lottery.start();

        const state = await lottery.getState();
        assert.equal(state.toNumber(), 0);
    });

    if (config.network !== 'development') {
        it('should add new player', async () => {
            const lottery = await Lottery.deployed();

            const enter = await lottery.enter("dogukan", { from: accounts[0], value: web3.utils.toWei('0.001', 'ether') });
            assert.isTrue(enter.receipt.status)
        });
    }

    it('should return closed(1) state', async () => {
        const lottery = await Lottery.deployed();
        await lottery.close();

        const state = await lottery.getState();
        assert.equal(state.toNumber(), 1);
    });
});
