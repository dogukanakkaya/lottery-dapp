const Lottery = artifacts.require('Lottery');

contract('Lottery', accounts => {
    let lottery;

    before(async () => {
        lottery = await Lottery.deployed();
        // lottery = await Lottery.at('0x7ea00526db7d121c2dafbfdd5f2e41fb5e1b5350');
    })

    it('should return start(0) state', async () => {
        await lottery.start();

        const state = await lottery.getState();
        assert.equal(state.toNumber(), 0);
    });

    if (config.network !== 'development') {
        // todo: deploy mocks for this one
        it('should add new player', async () => {
            const enter = await lottery.enter("dogukan", { from: accounts[0], value: web3.utils.toWei('0.001', 'ether') });
            assert.isTrue(enter.receipt.status)
        });
    }

    it('should return closed(1) state', async () => {
        await lottery.close();

        const state = await lottery.getState();
        assert.equal(state.toNumber(), 1);
    });
});
