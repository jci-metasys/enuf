const colors = require("colors/safe")
const _ = require("lodash")
const { table, getBorderCharacters } = require("table")
const { getTranslations, getEnums } = require("./data")

/* global process */
/* eslint-disable no-console */

function findSet({ enumsByName, enumsById }, setArg) {

    if (_.isNumber(setArg)) {
        return enumsById[setArg]
    }

    var set = _.find(enumsByName, (set, name) => name.toLowerCase() === _.toLower(setArg))
    if (set) {
        return set
    }


}

function findMember(members, memberArg) {

    if (_.isNumber(memberArg) && members[memberArg]) {
        return memberArg
    }

    return _.findKey(members, value => value.split(".")[1].toLowerCase() === _.toLower(memberArg))
}

const tableConfig = {
    border: getBorderCharacters("void"),
    columnDefault: {
        paddingLeft: 0,
        paddingRight: 3
    },
    drawHorizontalLine: () => {
        return false
    },
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

/*

{
    border: getBorderCharacters(`void`),
    columnDefault: {
        paddingLeft: 0,
        paddingRight: 1
    },
    drawHorizontalLine: () => {
        return false
    }

    */

function createTableHeader(enumSetName, enumSetId, enumSetDescription) {
    return [
        [colors.bold("Name"), colors.bold("Id"), colors.bold("Description")],
        [colors.brightBlue(enumSetName), colors.brightBlue(enumSetId), colors.brightBlue(enumSetDescription)],
    ]
}


function printEnumMember(translations, enumSet, memberId) {
    const data = createTableHeader(enumSet.name, enumSet.id, translations[enumSet.key].title)

    data.push([enumSet.members[memberId], memberId, translations[enumSet.key].oneOf[memberId]])
    const output = table(data, tableConfig)
    console.log(output)
}

function printEnumSet(translations, enumSet) {
    const data = createTableHeader(enumSet.name, enumSet.id, translations[enumSet.key].title)


    const members = _.chain(enumSet.members)
        .toPairs()
        .map(pair => [`${pair[1]}`, pair[0], translations[enumSet.key].oneOf[pair[0]]])
        .sortBy(triple => parseInt(triple[1], 10))
        .value()

    members.forEach(member => data.push(member))

    const output = table(data, tableConfig)
    console.log(output)
}

function search([setArg, memberArg], { useOriginal }) {
    if (!process.stdout.isTTY) {
        // output is going to a file, disable color markers
        colors.disable()
    }

    if (setArg || setArg === 0) {

        const enums = getEnums(useOriginal)

        const set = findSet(enums, setArg)
        if (set) {
            const translations = getTranslations(useOriginal)
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

module.exports = { search }
