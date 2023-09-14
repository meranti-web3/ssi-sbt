const axios = require("axios");
//const ethers_1 = require("ethers");
const qs = require("qs");

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

describe("Given User doesn't own a token", () => {
  const url = "http://localhost:3000/has/0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

  const headers = {
    "X-BLOCKCHAIN": "ETHEREUM",
    "X-API-KEY": "testKey"
  };

  test("Verify that User doesn't own the token", async () => {
    const hasResponse = await axios.get(url, { headers });

    expect(hasResponse.data.has_token).toBe(false);
  });

  describe("When a token is minted for User", () => {
    const mintUrl = "http://localhost:3000/mint";

    const data = qs.stringify({
      transfer_to: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      ipfs_url: ''
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-BLOCKCHAIN": "ETHEREUM",
      "X-API-KEY": "testKey"
    };

    test("Verify if the operation hash is valid", async () => {
      const mintResponse = await axios.post(mintUrl, data, { headers });

      expect(mintResponse.data.tx_hash).toMatch(/^0x([A-Fa-f0-9]{64})$/);
    });

    describe("Then a new token is created", () => {
      const url = "http://localhost:3000/has/0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

      const headers = {
        "X-BLOCKCHAIN": "ETHEREUM",
        "X-API-KEY": "testKey"
      };

      beforeAll(() =>
        waitFor(async function testFn() {
          const hasResponse = await axios.get("http://localhost:3000/has/0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", {
            headers
          });

          return hasResponse.data.has_token;
        })
      );

      test("Verify if User owns the new token", async () => {
        const hasResponse = await axios.get(url, { headers });

        expect(hasResponse.data.has_token).toBe(true);
      });

      describe("When a token is burned", () => {
        const burnUrl = "http://localhost:3000/burn";

        const data = qs.stringify({
          address_for: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
        });

        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-BLOCKCHAIN": "ETHEREUM",
          "X-API-KEY": "testKey"
        };

        test("Verify if the operation hash is valid", async () => {
          const burnResponse = await axios.post(burnUrl, data, { headers });

          expect(burnResponse.data.tx_hash).toMatch(/^0x([A-Fa-f0-9]{64})$/);
        });
      });
    });
  });
});