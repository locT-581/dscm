const test1 = artifacts.require("test1");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("test1", function (/* accounts */) {
  it("should assert true", async function () {
    await test1.deployed();
    return assert.isTrue(true);
  });
});
