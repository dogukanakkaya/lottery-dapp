require('dotenv').config();

module.exports = ({
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    INFURA_KEY: process.env.INFURA_KEY,
    VRF_SUBSCRIPTION_ID: process.env.VRF_SUBSCRIPTION_ID,
})