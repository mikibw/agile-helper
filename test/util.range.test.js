const { expect } = require("chai");
const { it } = require("mocha");

const range = require("../utils/range");

describe("test range", () => {
  it("should be an array with numbers", () => {
    const r = range(0, 3);
    expect(r).to.be.an("array");
    expect(r).to.be.deep.equal([0, 1, 2, 3]);
  });
});
