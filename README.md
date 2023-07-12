![](https://i.ibb.co/bRVhSBn/2023-06-27-00-59-28.png)

# L0 AIO by @ruburi

## Supported networks

- Avalanche
- Arbitrum
- BSC
- Optimism
- Polygon

## Features

- [STG stake](https://stargate.finance/stake/)
- [testnetbridge](https://testnetbridge.com/)
- [bitcoinbridge](https://bitcoinbridge.network/)
- [aptosbridge](https://theaptosbridge.com/bridge/)
- [stargatebridge](https://stargate.finance/transfer/)
- [harmonybridge](https://layerzero.bridge.harmony.one/)
- [jumper.exchange](https://jumper.exchange/)
- [woofi](https://fi.woo.org/)

## Customize settings
In the `config.js` file, you can customize settings.

- `stgStakePeriodInMonths` is responsible for how many months to steak STG for
- `slippage` is responsible for the default slippage during swaps and other conversions
- `percentage` is responsible for what percentage of the native balance will be swapped into GETH and BTCb (example, `swapToGeth: 5`)
- `chainsForInteractions` is responsible for the list of networks the software will work with
- `chainsCount` is responsible for the number of networks to be affected (from and to)
- `interactionsInterval` is responsible for how many seconds there should be a break between interactions (from and to)
- `interactionsCount` is responsible for how many times you need to do an action. If you want to do some action indefinitely, just set the numbers `Infinity` together
- `stablesForInteraction` is responsible for how many stable tokens will be spent in any given action (from and to)

## Before launch
The main stable token for BSC is **USDT**, for other networks it is **USDC**

1. Spread the commissions over the desired networks (from $2)
2. Send stable tokens to one of the networks (from $0.5)
3. Enter private keys into `keys.example.json` file (you need private keys for EVM and Aptos **without 0x**, there is an example inside).
4. Rename `keys.example.json` to `keys.json`.
5. Run the software

## Start-up instructions
1. Install [Nodejs](https://nodejs.org/en/download)
2. Clone the repository or download the archive
3. Go to the folder with the software in the console and write the command `npm install`
4. Type `npm run start` in the console to start the software

## You have to keep in mind
The software approves 10x of what it is going to swap. That is, if 500 USDC is approved, then 50 USDC will be swapped.

If you find bugs or encounter other problems with the software - write [@rubyuroboros](https://t.me/rubyuroboros) in Telegram or in the Telegram channel comments below the post.
