const { randomBytes } = require("crypto");

console.log(randomBytes(32).toString("hex"));
