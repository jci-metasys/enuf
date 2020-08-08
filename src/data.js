const path = require("path")
const fs = require("fs")
const _ = require("lodash")
const os = require("os")

const defaultVersion = "8.0.0.2908"
const defaultLang = "en_US"

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
        const setFile = path.join(dataDir, version || defaultVersion, `${langCode || defaultLang}_allSets.json`)
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

const getEnums = _.memoize(getEnumsInternal)

function getEnumSetInternal(setArg, version, langCode) {
    const enums = getEnums(version, langCode)
    return _.find(enums, set =>
        (set.name === setArg) || (set.originalName === setArg) || (set.id === setArg)
    )
}

const getEnumSet = _.memoize(getEnumSetInternal)

module.exports = { getEnums, getEnumSet, getDataDir }
