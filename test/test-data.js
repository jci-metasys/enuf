const fs = require("fs")
const path = require("path")
const { expect } = require("chai")
const { getEnums } = require("../src/data")
const { fail } = require("assert")

const packageDir = path.dirname(__dirname)
const testDataDir = path.join(packageDir, "test", "data")


function testEnvironmentVariables() {
    const originalEnv = { ...process.env }

    process.env.ENUF_LANG = "en_GB"
    try {
        getEnums()
        fail("Expected getEnums to throw")
        // eslint-disable-next-line no-empty
    } catch {
    }

    process.env.ENUF_VERSION = "test-version"
    process.env.ENUF_DATA_DIR = testDataDir
    const fileName = path.join(testDataDir, "test-version", "en_GB_allSets.json")
    const expected = JSON.parse(fs.readFileSync(fileName, { encoding: "utf8" }))
    expect(getEnums()).deep.equals(expected)

    process.env = { ...originalEnv }
}

// Explicitly not using lambda so that the `this` var is set
// apropriately so I can call skip dynamically
// Due to the use of env vars it doesn't play well with the rest
// of the suite.
describe("getEnums", function () {

    it("Test Env Variables", function() {
        if (process.env.ENUF_INCLUDE_SKIP_TEST) {
            testEnvironmentVariables()
        } else {

            this.skip()
        }
    })

})