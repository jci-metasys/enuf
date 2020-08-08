const fs = require("fs")
const path = require("path")
const { expect } = require("chai")
const { getEnums } = require("../src/data")
const { fail } = require("assert")

const packageDir = path.dirname(__dirname)
const testDataDir = path.join(packageDir, "test", "data")


function testEnvironmentVariables() {
    const originalEnv = { ...process.env }

    process.env.ENUF_DATA_DIR = testDataDir

    // should be able to find a language pack without version
    const gbFileName = path.join(testDataDir, "test-version", "en_GB_allSets.json")
    const gbExpected = JSON.parse(fs.readFileSync(gbFileName, { encoding: "utf8" }))
    expect(getEnums(undefined, "en_GB")).deep.equal(gbExpected)

    // should be able to find a language pack without language code
    // In this case the default will be en_US
    const usFileName = path.join(testDataDir, "test-version", "en_US_allSets.json")
    const usExpected = JSON.parse(fs.readFileSync(usFileName, { encoding: "utf8" }))
    expect(getEnums("test-version")).deep.equal(usExpected)

    process.env = { ...originalEnv }
}

// Explicitly not using lambda so that the `this` var is set
// apropriately so I can call skip dynamically
// Due to the use of env vars it doesn't play well with the rest
// of the suite.
describe("getEnums", function () {

    it("Test Get Enums", function() {
        if (process.env.ENUF_INCLUDE_SKIP_TEST) {
            testEnvironmentVariables()
        } else {

            this.skip()
        }
    })

})