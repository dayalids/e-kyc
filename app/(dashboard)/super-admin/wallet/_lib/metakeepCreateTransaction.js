import { MetaKeep } from 'metakeep'
import Web3 from 'web3'
import { TEST_NET } from '../_data/chainOptions'

/**
 * This function creates a transaction using the MetaKeep API.
 *
 * @async
 * @param {SendModalFormType} reqData - The data for the transaction.
 * @property {string} reqData.sendFrom - The address to send from.
 * @property {string} reqData.sendTo - The address to send to.
 * @property {string} reqData.asset - The asset to send.
 * @property {number} reqData.amount - The amount to send.
 * @returns {Promise} A promise that resolves with the response from the MetaKeep API.
 */
export const metakeepCreateTransaction = async (reqData, env) => {
  // console.log('Inside ADD Submit Button from wallet', reqData, env)
	// return

	/* Get signature using web3 provider */
	//   async function web3Sign() {

  const testNetConfig = {
    appId: process.env.NEXT_PUBLIC_TEST_METAKEEP_APP_ID,
    chainId: process.env.NEXT_PUBLIC_TEST_BBN_NETWORK_ID,
    rpcNodeUrls: {
      [process.env.NEXT_PUBLIC_TEST_BBN_NETWORK_ID]:
				process.env.NEXT_PUBLIC_TEST_BBN_RPC_URL
    }
  }
  const mainNetConfig = {
    appId: process.env.NEXT_PUBLIC_MAIN_METAKEEP_APP_ID,
    chainId: process.env.NEXT_PUBLIC_MAIN_BBN_NETWORK_ID,
    rpcNodeUrls: {
      [process.env.NEXT_PUBLIC_MAIN_BBN_NETWORK_ID]:
				process.env.NEXT_PUBLIC_MAIN_BBN_RPC_URL
    }
  }

  const selectedConfig =
		env.value === TEST_NET.value ? testNetConfig : mainNetConfig

  try {
    console.log(
			process.env.METAKEEP_APP_ID,
			process.env.BBN_NETWORK_ID,
			process.env.BLOCKCHAIN_NODE_RPC_URL
		)
    const sdk = new MetaKeep(selectedConfig)

    // console.log('Initiazing MetaKeep Web3 provider')

		/* Use MetaKeep web3 provider */
    const web3 = new Web3(await sdk.ethereum)

		// Get accounts
    const web3Accounts = await web3.eth.getAccounts()

		// Sign message
		// const signMessageResponse = await web3.eth.sign("message", web3Accounts[0]);
    const gasPriceInWei = web3.utils.toWei('20', 'gwei')

		// const amountToSendWei = web3.utils.toWei(reqData.amount, 'ether');
		// Send txn. Will fail if there are no tokens to pay for gas fee.
    const signTxnResponse = await web3.eth.sendTransaction(
      {
        from: web3Accounts[0],
        to: reqData.sendTo,
        value: web3.utils.toWei(reqData.amount, 'ether'),
        gasPrice: gasPriceInWei
      },
			web3Accounts[0]
		)
    // console.log('sign txn successful')
    // console.log(signTxnResponse)
    return signTxnResponse
  } catch (err) {
    // console.log('Error when trying to sign')
    // console.log(err || err)
  }
}
