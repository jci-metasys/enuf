const fs = require("fs")
const path = require("path")
const { expect } = require("chai")
const { getEnums } = require("../src/data")
const { fail } = require("assert")

const packageDir = path.dirname(__dirname)
const testDataDir = path.join(packageDir, "test", "data")


function testEnvironmentVariables(done) {
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

    process.env = { ...originalEnv}
    done()
}

describe("getEnums", () =>
    xit("Test Env Variables", done => testEnvironmentVariables(done))
)