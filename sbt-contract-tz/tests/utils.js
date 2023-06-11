const { tzip12 } = require("@taquito/tzip12");

module.exports = {
  originateFA2Contract: async function originateFA2Contract(tezos, code, storage) {
    const originatonOperation = await tezos.contract.originate({
      code,
      storage
    });
    const { contractAddress } = originatonOperation;

    await originatonOperation.confirmation();

    return tezos.contract.at(contractAddress, tzip12);
  }
};
