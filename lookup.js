const colors = require("colors/safe")
const _ = require("lodash")
const { table, getBorderCharacters } = require("table")
const { getEnumSet } = require("./data")

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

        },
        2: {
            alignment: "right"
        },
        3: {
            width: 25,
            wrapWord: true
        }
    }
}

function createTableHeader(name, originalName, id, display) {
    return [
        [colors.bold("Name"), colors.bold("NAME"), colors.bold("Id"), colors.bold("Description")],
        [colors.blue(name), colors.blue(originalName), colors.blue(id), colors.blue(display)]
    ]
}

function printTable(data, console) {
    console.log()
    if (!process.env.enuf_BORDER) {
        _.merge(tableConfig, noBorderTableConfig)
    }

    const output = table(data, tableConfig)
    console.log(output)

}

function printEnumMembers(enumSet, members) {
    const console = new Console()

    const data = createTableHeader(enumSet.name, enumSet.originalName, enumSet.id, enumSet.display)

    data.push(["","","",""])
    data.push([colors.bold("Name"), colors.bold("NAME"), colors.bold("Id"), colors.bold("Description")])

    members.forEach(member => data.push([member.name, member.originalName, member.id, member.display]))

    printTable(data, console)
    return console.toString()
}

function printEnumSet(enumSet) {
    const console = new Console()

    const data = createTableHeader(enumSet.name, enumSet.originalName, enumSet.id, enumSet.display)

    data.push(["","","",""])
    data.push([colors.bold("Name"), colors.bold("NAME"), colors.bold("Id"), colors.bold("Description")])

    const members = _.chain(enumSet.members)
        .sortBy(member => member.id)
        .map(member => [member.name, member.originalName, member.id, member.display])
        .value()

    members.forEach(member => data.push(member))

    printTable(data, console)
    return console.toString()
}

function findMember(set, memberArg) {
    return _.chain(set.members)
        .filter(member => member.name === memberArg || member.originalName === memberArg || member.id === memberArg)
        .value()
}

function lookup([setArg, ...memberArgs]) {

    if (!process.stdout.isTTY) {
        // output is going to a file, disable color markers
        colors.disable()
    }

    if (setArg || setArg === 0) {

        const set = getEnumSet(setArg)
        if (set) {

            if (_.isUndefined(memberArgs) || memberArgs.length === 0) {
                return printEnumSet(set)
            }

            const members = _.chain(memberArgs)
                .flatMap(memberArg => findMember(set, memberArg))
                .filter(member => !_.isUndefined(member))
                .value()

            if (members.length === 0) {
                console.warn(`No matching members found in set '${setArg}'`)
            }

            return printEnumMembers(set, members)

        } else {
            console.warn(`Set '${setArg}' not found`)
        }
    }
}

module.exports = { lookup }
