const fs = require("fs")
const colors = require("colors/safe")
const path = require("path")
const _ = require("lodash")
const { table } = require("table")


/* global process */
/* eslint-disable no-console */

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

function complete([partialSetName, partialMemberName]) {

    const { enumsByName } = getEnums()

    if (!partialSetName && !partialMemberName) {
        return _.keys(enumsByName)
    }

    if (partialSetName) {
        const setMatches = _.filter(
            _.keys(enumsByName),
            setName => _.startsWith(setName, partialSetName),
        )

        if (!partialMemberName) {
            if (setMatches.length === 1 && setMatches[0] === partialSetName) {
                const setName = partialSetName

                const { members } = enumsByName[setName]

                return _.map(_.values(members), memberKey => memberKey.split(".")[1])
            }
            return setMatches
        } else {
            const setName = partialSetName

            const memberNames = _.map(_.values(enumsByName[setName].members),
                memberKey => memberKey.split(".")[1])

            const matches = _.filter(memberNames,
                memberName => _.startsWith(memberName, partialMemberName),
            )

            if (matches.length === 1 && matches[0] === partialMemberName) {
                return []
            }
            return matches
        }
    }
}

function findSet({ enumsByName, enumsById }, setArg) {

    if (_.isNumber(setArg)) {
        return enumsById[setArg]
    }

    var set = _.find(enumsByName, (set, name) => name.toLowerCase() === setArg.toLowerCase())
    if (set) {
        return set
    }


}

function findMember(members, memberArg) {

    if (_.isNumber(memberArg) && members[memberArg]) {
        return memberArg
    }

    return _.findKey(members, value => value.split(".")[1].toLowerCase() === memberArg.toLowerCase())
}

const tableConfig = {
    columns: {
        0: {
        },
        1: {
            alignment: "right"
        },
        2: {
            width: 25,
            wrapWord: true
        }
    }
}

function createTableHeader(enumSetId, enumSetName, enumSetDescription) {
    return [
        [colors.bold("Name"), colors.bold("Id"), colors.bold("Description")],
        [colors.brightBlue(enumSetName), colors.brightBlue(enumSetId), colors.brightBlue(enumSetDescription)],
    ]
}


function printEnumMember(translations, enumSet, memberId) {
    const data = createTableHeader(enumSet.id, enumSet.name, translations[enumSet.key].title)

    data.push([enumSet.members[memberId], memberId, translations[enumSet.key].oneOf[memberId]])
    const output = table(data, tableConfig)
    console.log(output)
}

function printEnumSet(translations, enumSet) {
    const data = createTableHeader(enumSet.id, enumSet.name, translations[enumSet.key].title)


    const members = _.chain(enumSet.members)
        .toPairs()
        .map(pair => [`${pair[1]}`, pair[0], translations[enumSet.key].oneOf[pair[0]]])
        .sortBy(triple => parseInt(triple[1], 10))
        .value()

    members.forEach(member => data.push(member))

    const output = table(data, tableConfig)
    console.log(output)
}

function main([setArg, memberArg]) {
    if (!process.stdout.isTTY) {
        // output is going to a file, disable color markers
        colors.disable()
    }

    if (setArg) {

        const enums = getEnums()

        const set = findSet(enums, setArg)
        if (set) {
            const translations = getTranslations()
            if (memberArg || memberArg === 0) {
                const memberId = findMember(set.members, memberArg)
                if (memberId || memberId === 0) {
                    printEnumMember(translations, set, memberId)
                } else {
                    console.error(`Set '${setArg}' has no member '${memberArg}'`)
                }
            } else {
                printEnumSet(translations, set)
            }

        } else {
            console.error(`Set '${setArg}' not found`)
        }
    }
}

module.exports = { main, complete }
