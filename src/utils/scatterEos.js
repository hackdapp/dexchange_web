import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';

const network = {
    blockchain: 'eos',
    protocol: 'http',
    host: '183.111.122.242',
    port: 7777,
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
}
const scatterEos = {

    isConnected: async function () {
        ScatterJS.plugins(new ScatterEOS());
        const connected = await ScatterJS.scatter.connect('My-App')
        return connected
    },

    pushEosAction : async function (params) {
        const connected = await scatterEos.isConnected()
        if (!connected) return false;
        const scatter = ScatterJS.scatter;
        const requiredFields = { accounts: [network] };

        const identityResult = await scatter.getIdentity(requiredFields);
        const eosOptions = { expireInSeconds: 60 };
        const eos = scatter.eos(network, Eos, eosOptions);
        const result = await eos.transaction(params);
        return result;
    },

    getEosAccount: async function () {
        const connected = await scatterEos.isConnected()
        if (!connected) return false;
        const scatter = ScatterJS.scatter;
        const requiredFields = { accounts: [network] };
        const identityResult = await scatter.getIdentity(requiredFields);
        const account = identityResult.accounts.find(x => x.blockchain === 'eos');
        return account;
    }

}

export default scatterEos;