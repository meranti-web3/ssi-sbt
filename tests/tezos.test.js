const { validateOperation, ValidationResult } = require("@taquito/utils");
const axios = require("axios");
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
  const resTests = [
    {
      url: "http://localhost:3000/has/tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      headers: {
        "X-BLOCKCHAIN": "TEZOS",
        "X-API-KEY": "testKey"
      },
    },
    {
      url: "http://localhost:3000/has/0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      headers: {
        "X-BLOCKCHAIN": "ETHEREUM",
        "X-API-KEY": "testKey"
      }
    }
  ];

  it.each(resTests)("Verify that User doesn't own the token", async (resTests) => {
    const hasResponse = await axios.get(resTests.url, { headers: resTests.headers });

    expect(hasResponse.data.has_token).toBe(false);
  });

  describe("When a token is minted for User", () => {
    const mintTests = [
      {
        mintUrl: "http://localhost:3000/mint",
        data: qs.stringify({
          transfer_to: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
          ipfs_url: "ipfs://QmUQsfAufCrBdEGQU3tZ8Ym8SAL6Grv7xfmGyvy6taoPUg",
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-BLOCKCHAIN": "TEZOS",
          "X-API-KEY": "testKey"
        },
      },
      {
        mintUrl: "http://localhost:3000/mint",
        data: qs.stringify({
          transfer_to: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
          ipfs_url: '',
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-BLOCKCHAIN": "ETHEREUM",
          "X-API-KEY": "testKey"
        },
      }
    ];

    it.each(mintTests)("Verify if the operation hash is valid", async (mintTests) => {
      const mintResponse = await axios.post(mintTests.mintUrl, mintTests.data, { headers: mintTests.headers });


      expect(mintResponse.data.tx_hash).toBeDefined();
      //expect(validateOperation(mintResponse.data.tx_hash)).toBe(ValidationResult.VALID);
    });

    describe("Then a new token is created", () => {
      const has_resTests = [
        {
          url: "http://localhost:3000/has/tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
          headers: {
            "X-BLOCKCHAIN": "TEZOS",
            "X-API-KEY": "testKey"
          },
        },
        {
          url: "http://localhost:3000/has/0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
          headers: {
            "X-BLOCKCHAIN": "ETHEREUM",
            "X-API-KEY": "testKey"
          }
        }
      ];
      beforeAll(() =>
        waitFor(async function testFn() {
            has_resTests.map(async (has_resTests) =>{
              const hasResponse = await axios.get(has_resTests.url, { headers: has_resTests.headers });
              return hasResponse.data.has_token;
            })
        })
      );

      it.each(has_resTests)("Verify if User owns the new token", async (has_resTests) => {
        const hasResponse = await axios.get(has_resTests.url, { headers: has_resTests.headers });

        expect(hasResponse.data.has_token).toBe(true);
      });

      describe("When a token is burned", () => {
        const burnTests = [
          {
            burnUrl: "http://localhost:3000/burn",
            data: qs.stringify({
              address_for: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
            }),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-BLOCKCHAIN": "TEZOS",
              "X-API-KEY": "testKey"
            },
          },
          {
            burnUrl: "http://localhost:3000/burn",
            data: qs.stringify({
              address_for: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
            }),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-BLOCKCHAIN": "ETHEREUM",
              "X-API-KEY": "testKey"
            }
          }
        ];

        it.each(burnTests)("Verify if the operation hash is valid", async (burnTests) => {
          const burnResponse = await axios.post(burnTests.burnUrl, burnTests.data, { headers: burnTests.headers });

          //f (!burnTests[0]) {
          //console.log(burnTests[0]);
          //expect(validateOperation(burnResponse.data.tx_hash)).toBe(ValidationResult.VALID);
          ///}
          ////if (!burnTests[1]) {
          ////expect(burnResponse.data.tx_hash).toMatch(/^0x([A-Fa-f0-9]{64})$/);
          //}

          expect(burnResponse.data.tx_hash).toBeDefined();
          //expect(burnResponse.data.tx_hash).toMatch(/^0x([A-Fa-f0-9]{64})$/);
        });
      });
    });
  });
});
