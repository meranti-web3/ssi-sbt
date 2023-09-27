const axios = require("axios");
const { validateOperation, ValidationResult } = require("@taquito/utils");
const qs = require("qs");

const SERVICE_URL = "http://localhost:3000";
const API_KEY = "testKey";

function waitFor(testFn, timeout = 10000, tick = 2000) {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const timerId = setInterval(function () {
      const testResult = testFn();

      if (testResult) {
        clearInterval(timerId);
        resolve(testResult);
      }

      if (Date.now() - startTime >= timeout) {
        clearInterval(timerId);
        reject(new Error("Timeout exceeded"));
      }
    }, tick);
  });
}

const tests = [
  {
    suiteName: "Tezos",
    blockchainName: "TEZOS",
    alicePublicKey: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    data: qs.stringify({
      transfer_to: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      ipfs_url: "ipfs://QmUQsfAufCrBdEGQU3tZ8Ym8SAL6Grv7xfmGyvy6taoPUg"
    }),
    data_burn: qs.stringify({
      address_for: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
    }),
    isValidHash: (hash) => {
      return Boolean(validateOperation(hash));
    }
  },
  {
    suiteName: "Ethereum",
    blockchainName: "ETHEREUM",
    alicePublicKey: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    data: qs.stringify({
      transfer_to: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      ipfs_url: ""
    }),
    data_burn: qs.stringify({
      address_for: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
    }),
    isValidHash: (hash) => {
      return /^0x([A-Fa-f0-9]{64})$/.test(hash); //fct test verifie que la string que j'ai rentrer match l'expression que j'ai defini = ca retourne un boolen
    }
  }
];

describe.each(tests)("Given service is running", ({ alicePublicKey, blockchainName, data, data_burn, isValidHash }) => {
  it("Verify that User doesn't own the token", async () => {
    const hasResponse = await axios.get(`${SERVICE_URL}/has/${alicePublicKey}`, {
      headers: {
        "X-BLOCKCHAIN": blockchainName,
        "X-API-KEY": API_KEY
      }
    });

    expect(hasResponse.data.has_token).toBe(false);
  });

  describe("When a new token is minted for User", () => {
    it("Verify if the operation hash is valid", async () => {
      //const isValidHash_tez = (hash) => { //peut-on introduire ces deux fonctions dans la suite name
      //return !!validateOperation(hash);
      //};

      const mintResponse = await axios.post(`${SERVICE_URL}/mint`, data, {
        headers: {
          "X-BLOCKCHAIN": blockchainName,
          "X-API-KEY": API_KEY
        }
      });
      expect(isValidHash(mintResponse.data.tx_hash)).toBe(true);
    });

    describe("Then a new token is created", () => {
      beforeAll(() =>
        waitFor(async function testFn() {
          const hasResponse = await axios.get(`${SERVICE_URL}/has/${alicePublicKey}`, {
            headers: {
              "X-BLOCKCHAIN": blockchainName,
              "X-API-KEY": API_KEY
            }
          });
          return hasResponse.data.has_token;
        })
      );
      it("Verify if the new user own the new token", async () => {
        const hasResponse = await axios.get(`${SERVICE_URL}/has/${alicePublicKey}`, {
          headers: {
            "X-BLOCKCHAIN": blockchainName,
            "X-API-KEY": API_KEY
          }
        });
        expect(hasResponse.data.has_token).toBe(true);
      });

      describe("When a token is burned", () => {
        it("Verify if the operation hash is valid", async () => {
          const burnResponse = await axios.post(`${SERVICE_URL}/burn`, data_burn, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-BLOCKCHAIN": blockchainName,
              "X-API-KEY": API_KEY
            }
          });
          expect(isValidHash(burnResponse.data.tx_hash)).toBe(true);
        });
      });
    });
  });
});
