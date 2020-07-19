const fs = require("fs")
const colors = require("colors/safe")
const path = require("path")
const _ = require("lodash")
const { table } = require("table")
const { set } = require("lodash")


/* global process */
/* eslint-disable no-console */

const installDir = path.dirname(process.argv[1])
const enumsFile = path.join(installDir, "data", "enums.json")
const translationsFile = path.join(installDir, "data", "translations.json")

function getTranslations() {
    return JSON.parse(fs.readFileSync(translationsFile, { encoding: "utf8" }))
}

function addIdAndNameToSet(set, key) {
    const [name, id] = key.split(".")
    return { ...set, id, name }
}

function getEnums() {
    const enumsByKey = JSON.parse(fs.readFileSync(enumsFile, { encoding: "utf8" }))

    const enumsByName = _.chain(enumsByKey)
        .mapValues(addIdAndNameToSet)
        .mapKeys(set => set.name)
        .value()

    const enumsById = _.mapKeys(enumsByName, set => set.id)

    return { enumsByName, enumsById, enumsByKey }
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

    var set = enumsByName[setArg]
    if (set) {
        return set
    }

    return enumsById[setArg]
}

function findMember(members, memberArg) {
    if (members[memberArg]) {
        return [memberArg, members[memberArg]]
    }

    return [_.findKey(members, value => value.split(".")[1] === memberArg), memberArg]
}

// function printEnumSet({enumsByName, enumsById}, translations, enumSet) {
//     console.log(colors.green(colors.bold(`${enumSet.description} (${enumSetName},${enumSet.id})`)))
//     const data = [
//         [colors.bold("Name"), colors.bold("Id"), colors.bold("Description")],
//     ]

//     const members = _.chain(enumSet.members)
//         .toPairs()
//         .map(pair => [`${enumSetName}.${pair[0]}`, pair[1].id, pair[1].description])
//         .sortBy(triple => triple[1])
//         .value()

//     members.forEach(member => data.push(member))

//     const output = table(data)
//     console.log(output)
// }

function main([setArg, memberArg]) {
    if (process.stdout.isTTY) {
        colors.enable()
    } else {
        // output is going to a file, disable color markers
        colors.disable()
    }

    if (setArg) {

        const enums = getEnums()

        // const {setName, setKey, set} = findSet(setArg, enums)
        // if (set) {
        //     const translations = getTranslations()
        //     if (memberArg) {
        //         const [memberId, memberShortName] = findMember(set.members, memberArg)
        //     } else {
        //         printEnumSet(enums, translations, set)
        //     }

        // } else {
        //     console.error("Set `${setArg}` not found")
        // }
    }
}

module.exports = { main, complete }
