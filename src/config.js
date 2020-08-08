const { getDataDir } = require("./data")
const path = require("path")
const fs = require("fs")

function config(option, value) {
    const dataDir = getDataDir()
    const configFile = path.join(path.dirname(dataDir), "config.json")

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
    }

    if (!option && !value) {
        if (!fs.existsSync(configFile)) {
            fs.writeFileSync(configFile, "{\n}")
            console.log(`Created empty config file '${configFile}'`)
        }
    }

    if (option && value) {
        const options = (fs.existsSync(configFile))
            ? JSON.parse(fs.readFileSync(configFile, {encoding:"utf8"}))
            : {}
        const splitOption = option.split(".")
        const primaryOption = splitOption[0]
        const secondaryOption = splitOption[1]

        if (!options[primaryOption]) {
            options[primaryOption] = {}
        }

        options[primaryOption][secondaryOption] = value

        fs.writeFileSync(configFile, JSON.stringify(options, null, 2))
    }

}

module.exports = { config }
