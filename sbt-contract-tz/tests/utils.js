module.exports = {
  originateSBTContract: async function originateSBTContract(tezos, code, storage) {
    const originatonOperation = await tezos.contract.originate({
      code,
      storage
    });
    const { contractAddress } = originatonOperation;

    await originatonOperation.confirmation();
    console.log(contractAddress);

    return tezos.contract.at(contractAddress);
  }
};
