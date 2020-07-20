const path = require("path")
const fs = require("fs")
const _ = require("lodash")

/* global process */

const executable = process.argv[1]
const installDir = path.dirname(fs.realpathSync(executable))

const enumsFile = path.join(installDir, "data", "enums.json")
const translationsFile = path.join(installDir, "data", "translations.json")

function getTranslations() {
    return JSON.parse(fs.readFileSync(translationsFile, { encoding: "utf8" }))
}

function addIdAndNameToSet(set, key) {
    const [name, id] = key.split(".")
    return { ...set, id, name, key }
}

function getEnums() {
    const enumsByKey = JSON.parse(fs.readFileSync(enumsFile, { encoding: "utf8" }))

    const enumsByName = _.chain(enumsByKey)
        .mapValues(addIdAndNameToSet)
        .mapKeys(set => set.name)
        .value()

    const enumsById = _.mapKeys(enumsByName, set => set.id)

    return { enumsByName, enumsById }
}

module.exports = { getTranslations, getEnums }