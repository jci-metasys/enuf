const path = require("path")
const fs = require("fs")
const _ = require("lodash")
const os = require("os")

function readConfig(option) {
    const dataDir = getDataDir()
    const configFile = path.join(path.dirname(dataDir), "config.json")

    if (!fs.existsSync(dataDir)) {
        return
    }

    if (!fs.existsSync(configFile)) {
        return
    }

    const options = JSON.parse(fs.readFileSync(configFile, {encoding:"utf8"}))
    return options[option]
}

function defaultLang() {
    const lang = readConfig("data.language")
    if (lang) return lang
    return "en_US"
}

/**
 * Returns the version with the highest value
 * checks config file, if not found it just sorts
 * the directories and returns the largest value
 */
function defaultVersion() {
    const version = readConfig("data.version")
    if (version) return _.toString(version)
    return _.chain(fs.readdirSync(getDataDir(), { withFileTypes: true }))
        .filter(dirEnt => dirEnt.isDirectory())
        .map(dirEnt => dirEnt.name)
        .sort()
        .last()
        .value()
}

function getDataDir() {
    if (process.env.ENUF_DATA_DIR) {
        return process.env.ENUF_DATA_DIR
    }

    return os.platform() === "win32"
        ? path.join(process.env.APPDATA, "@metasys-server", "enuf", "data")
        : path.join(os.homedir(), ".@metasys-server", "enuf", "data")

}

function getSetsFileNameInternal(version, langCode) {
    const dataDir = getDataDir()

    if (version || langCode) {
        // If either is specified, then a specific file is requested.
        // Attempt to find it:
        const setFile = path.join(dataDir, version || defaultVersion(), `${langCode || defaultLang()}_allSets.json`)
        if (fs.existsSync(setFile)) {
            return setFile
        }
        // Warn that we could not find a matching file
        const error = `Could not find requested data file '${setFile}'.\n`
            + "Falling back to built-in default file."
        throw new Error(error)
    }

    // return package default file
    const installDir = path.dirname(path.dirname(__filename))
    const allSetsFile = path.join(installDir, "data", "_allSets.json")
    return allSetsFile
}

function getSetsFileName(version, langCode) {
    const actualLangCode = langCode || process.env.ENUF_LANG
    const actualVersion = version || process.env.ENUF_VERSION
    return getSetsFileNameInternal(actualVersion, actualLangCode)
}


function getEnumsInternal(version, langCode) {
    const allSetsFile = getSetsFileName(version, langCode)
    return JSON.parse(fs.readFileSync(allSetsFile), { encoding: "utf8" })
}

const getEnums = _.memoize(getEnumsInternal, (...args) => {
    return args.join(" ")
})

function getEnumSetInternal(setArg, version, langCode) {
    const enums = getEnums(version, langCode)
    return _.find(enums, set =>
        (set.name === setArg) || (set.originalName === setArg) || (set.id === setArg)
    )
}

const getEnumSet = _.memoize(getEnumSetInternal, (...args) => {
    return args.join(" ")
})

module.exports = { getEnums, getEnumSet, getDataDir }
