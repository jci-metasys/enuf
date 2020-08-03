const path = require("path")
const fs = require("fs")
const _ = require("lodash")

/* global  __filename */

const installDir = path.dirname(__filename)
const allSetsFile = path.join(installDir, "data", "_allSets.json")

function getEnumsInternal() {

    return JSON.parse(fs.readFileSync(allSetsFile), { encoding: "utf8" })
}

const getEnums = _.memoize(getEnumsInternal)

function getEnumSetInternal(setArg) {
    const enums = getEnums()
    return _.find(enums, set =>
        (set.name === setArg) || (set.originalName === setArg) || (set.id === setArg)
    )
}

const getEnumSet = _.memoize(getEnumSetInternal)

module.exports = { getEnums, getEnumSet }