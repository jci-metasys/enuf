const colors = require("colors/safe")
const _ = require("lodash")
const { table, getBorderCharacters } = require("table")
const { getTranslations, getEnums } = require("./data")

/* global process */
/* eslint-disable  */

class Console {

    constructor() {
        this.buffer = []
    }

    log(value) {
        this.buffer.push(_.trimEnd(value))
    }

    toString() {
        return this.buffer.join("\n")
    }

}

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
    if (_.isUndefined(memberArg)) {
        return
    }

    if (_.isNumber(memberArg) && members[memberArg]) {
        return memberArg
    }

    return _.findKey(members, value => value.split(".")[1].toLowerCase() === _.toLower(memberArg))
}

const noBorderTableConfig = {
    border: getBorderCharacters("void"),
    columnDefault: {
        paddingLeft: 0,
        paddingRight: 3
    },
    drawHorizontalLine: () => {
        return false
    },
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

function createTableHeader(enumSetName, enumSetId, enumSetDescription) {
    return [
        [colors.bold("Name"), colors.bold("Id"), colors.bold("Description")],
        [colors.brightBlue(enumSetName), colors.brightBlue(enumSetId), colors.brightBlue(enumSetDescription)],
    ]
}

function printTable(data) {
    console = new Console()
    console.log()
    if (!process.env.enuf_BORDER) {
        _.merge(tableConfig, noBorderTableConfig)
    }

    const output = table(data, tableConfig)
    console.log(output)

    return console.toString()
}

function printEnumMembers(translations, enumSet, memberIds) {
    const data = createTableHeader(enumSet.name, enumSet.id, translations[enumSet.key].title)

    memberIds.forEach(memberId => data.push([enumSet.members[memberId], memberId, translations[enumSet.key].oneOf[memberId]]))

    return printTable(data)
}

function printEnumSet(translations, enumSet) {
    const data = createTableHeader(enumSet.name, enumSet.id, translations[enumSet.key].title)


    const members = _.chain(enumSet.members)
        .toPairs()
        .map(pair => [`${pair[1]}`, pair[0], translations[enumSet.key].oneOf[pair[0]]])
        .sortBy(triple => parseInt(triple[1], 10))
        .value()

    members.forEach(member => data.push(member))

    return printTable(data)
}

function lookup([setArg, ...memberArgs]) {

    if (!process.stdout.isTTY) {
        // output is going to a file, disable color markers
        colors.disable()
    }

    // Check to see if user is entering upper case, if so search original names
    const originalNames = !_.isUndefined(setArg) && _.isString(setArg)
        && setArg.length > 0 && (setArg[0] === setArg[0].toUpperCase())

    if (setArg || setArg === 0) {

        const enums = getEnums(originalNames)

        const set = findSet(enums, setArg)
        if (set) {
            const translations = getTranslations(originalNames)

            if (_.isUndefined(memberArgs) || memberArgs.length === 0) {
                return printEnumSet(translations, set)
            }

            const memberIds = _.chain(memberArgs)
                .map(member => findMember(set.members, member))
                .filter(id => !_.isUndefined(id))
                .value()

            if (memberIds.length === 0) {
                console.warn(`No matching members found in set '${setArg}'`)
            }

            return printEnumMembers(translations, set, memberIds)

        } else {
            console.warn(`Set '${setArg}' not found`)
        }
    }
}

module.exports = { lookup }
