const { compose } = require("@taquito/taquito");
const { tzip12 } = require("@taquito/tzip12");
const { tzip16 } = require("@taquito/tzip16");

module.exports = {
  originateFA2Contract: async function originateFA2Contract(tezos, code, storage) {
    const originatonOperation = await tezos.contract.originate({
      code,
      storage
    });
    const { contractAddress } = originatonOperation;

    await originatonOperation.confirmation();

    return tezos.contract.at(contractAddress, compose(tzip12, tzip16));
  }
};
