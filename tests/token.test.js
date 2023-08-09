const { validateOperation, ValidationResult } = require("@taquito/utils");
const axios = require("axios");
const qs = require("qs");

describe("Test API mint", () => {
  test("Verify if the operation hash is valid", async () => {
    const url = "http://localhost:3000/mint";

    const data = qs.stringify({
      transfer_to: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      ipfs_url: "ipfs://QmUQsfAufCrBdEGQU3tZ8Ym8SAL6Grv7xfmGyvy6taoPUg"
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-BLOCKCHAIN": "TEZOS",
      "X-API-KEY": "testKey"
    };
    const response = await axios.post(url, data, { headers });
    expect(validateOperation(response.data.tx_hash)).toBe(ValidationResult.VALID);
  });
});
