const Lottery = artifacts.require('Lottery');
const VRFCoordinatorV2Mock = artifacts.require('VRFCoordinatorV2Mock');
const MockV3Aggregator = artifacts.require('MockV3Aggregator');

contract('Lottery', accounts => {
    let lottery;
    let vrfCoordinatorV2Mock;

    before(async () => {
        vrfCoordinatorV2Mock = await VRFCoordinatorV2Mock.deployed();
        await MockV3Aggregator.deployed();
        lottery = await Lottery.deployed();
    })

    it('should return start(0) state', async () => {
        await lottery.start();
        const state = await lottery.getState();

        assert.equal(state.toNumber(), 0);
    });

    it('should add new player', async () => {
        const playerTransactions = [
            await lottery.enter("dogukan", { from: accounts[0], value: web3.utils.toWei('0.001', 'ether') }),
            await lottery.enter("nobody", { from: accounts[1], value: web3.utils.toWei('0.001', 'ether') })
        ];

        assert.isTrue(playerTransactions.every(tx => tx.receipt.status));
    });

    it('should calculate winner', async () => {
        const subscriptionTx = await vrfCoordinatorV2Mock.createSubscription();
        const subId = subscriptionTx.logs[0].args.subId;

        // we have to fund the subscription to be able to request random words
        await vrfCoordinatorV2Mock.fundSubscription(subId, web3.utils.toWei('1', 'ether'));

        const calculateWinner = () => {
            return new Promise(async resolve => {
                vrfCoordinatorV2Mock.RandomWordsRequested().on('data', async event => {
                    const { requestId } = event.returnValues;

                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, lottery.address);

                    resolve(true);
                });

                await lottery.calculateWinner();
            });
        }

        lottery.WinnerCalculated().on('data', event => {
            const { winner } = event.returnValues;

            assert.oneOf(winner._address, [accounts[0], accounts[1]]);
        });

        await calculateWinner();
    });
});
