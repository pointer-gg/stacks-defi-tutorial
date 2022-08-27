import { Clarinet, Tx, Chain, Contract, Account, types, StacksNode } from 'https://deno.land/x/clarinet@v0.31.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Lottery Mock",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    console.log()
    console.log("Lottery contract deploying Mocks...")
    console.log()

    let deployerAdress = accounts.get("deployer")!.address
    console.log("Contract owner account address:  " + deployerAdress)
    let playersAddress = [1, 2, 3, 4, 5].map(i => accounts.get("wallet_" + i)!.address)
    playersAddress.forEach((address, i) => console.log("player_" + i + " address: " + address))
    console.log()

    console.log("Querying lottery basic info...")
    console.log()

    let fee = chain.callReadOnlyFn("lottery", "get-fee", [], deployerAdress)
    console.log("Lottery fee is: " + fee.result + " STX")

    let entryFeeRateResult = chain.callReadOnlyFn("lottery", "get-entry-fee-rate", [], deployerAdress).result
    // in this contract, entry-fee-rat 1 means 0.01%
    let entryFeeRate = parseInt(entryFeeRateResult.replace('u', '')) / 100
    console.log("Lottery entryFeeRate is(how much do you pay for the entry fee): " + entryFeeRate + "%")

    let lotteryState = chain.callReadOnlyFn("lottery", "get-lottery-state", [], deployerAdress).result
    console.log("Lottery current state is: " + lotteryState)

    let players = chain.callReadOnlyFn("lottery", "get-players", [], deployerAdress).result
    console.log("Lottery current players are:  " + players)

    let jackpots = chain.callReadOnlyFn("lottery", "get-jackpots", [], deployerAdress).result
    console.log("Lottery current jackpots are:  " + jackpots + " STX")

    console.log()
    console.log("Send block tx. Player 1 to 5 participate this lottery...")

    let block = chain.mineBlock([
      Tx.contractCall("lottery", "participate-in-lottery", [], playersAddress[0]),
      Tx.contractCall("lottery", "participate-in-lottery", [], playersAddress[1]),
      Tx.contractCall("lottery", "participate-in-lottery", [], playersAddress[2]),
      Tx.contractCall("lottery", "participate-in-lottery", [], playersAddress[3]),
      Tx.contractCall("lottery", "participate-in-lottery", [], playersAddress[4]),
    ]);

    console.log()
    players = chain.callReadOnlyFn("lottery", "get-players", [], deployerAdress).result
    console.log("Lottery current players are:  " + players)

    jackpots = chain.callReadOnlyFn("lottery", "get-jackpots", [], deployerAdress).result
    console.log("Lottery current jackpots are:  " + jackpots + " STX")

    console.log()
    console.log("Send block tx. Close the lottery and to calculate the winner...")
    console.log()

    block = chain.mineBlock([
      Tx.contractCall("lottery", "end-lottery", [], deployerAdress),
      Tx.contractCall("lottery", "calculate-lottery-winner", [], deployerAdress),
    ]);

    lotteryState = chain.callReadOnlyFn("lottery", "get-lottery-state", [], deployerAdress).result
    console.log("Lottery current state is: " + lotteryState)
    let winner = chain.callReadOnlyFn("lottery", "get-lasted-winner-info", [], deployerAdress).result
    console.log("Lottery last winner info is: " + winner)

    console.log()
    console.log("Update the fee to u200000 STX, entryFeeRate to 20%, and then start the lottery again...")

    block = chain.mineBlock([
      Tx.contractCall("lottery", "update-fee", ['u200000'], deployerAdress),
      Tx.contractCall("lottery", "update-entry-fee-rate", ['u2000'], deployerAdress),
      Tx.contractCall("lottery", "open-lottery", [], deployerAdress),
    ]);

    console.log("Querying lottery basic info...")
    console.log()

    fee = chain.callReadOnlyFn("lottery", "get-fee", [], deployerAdress)
    console.log("Lottery fee is: " + fee.result + " STX")

    entryFeeRateResult = chain.callReadOnlyFn("lottery", "get-entry-fee-rate", [], deployerAdress).result
    entryFeeRate = parseInt(entryFeeRateResult.replace('u', '')) / 100
    console.log("Lottery entryFeeRate is(how much do you pay for the entry fee): " + entryFeeRate + "%")

    lotteryState = chain.callReadOnlyFn("lottery", "get-lottery-state", [], deployerAdress).result
    console.log("Lottery current state is: " + lotteryState)

    players = chain.callReadOnlyFn("lottery", "get-players", [], deployerAdress).result
    console.log("Lottery current players are:  " + players)

    jackpots = chain.callReadOnlyFn("lottery", "get-jackpots", [], deployerAdress).result
    console.log("Lottery current jackpots are:  " + jackpots + " STX")
  },
});
