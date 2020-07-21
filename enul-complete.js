const { getEnums, getEnumNamesAndIds } = require("./data")
const _ = require("lodash")

function completeCommands() {

    const commands = ["help", "search", "SEARCH"]

    return _.join(commands, " ")
}

/**
 * The input args are
 * @param {} args
 */
function complete([cursorWordPosition, ...args]) {
    // At this level these are the options
    // 2. Argument Matching
    //    a. no chars for next argument (return all choices for this argument)
    //    a. it's been started, but not completed (return all matches for this argument)
    //    b. it's been finished, no space after has been entered, (return single match)
    //    c. it's been finished, at least one space after: go to Argument Matching and match next argument


    // We only attempt to auto-complete the last argument (if cursor is on it),
    // or the next argument if cursor is on a space after all other arguments


    // Handle first argument (the command argument)
    const commandArg = args[0]

    switch (cursorWordPosition) {
        case 1: // still on command
            return completeCommands(commandArg)

        case 2: // First argument of command
            switch (commandArg) {
                case "SEARCH":
                case "search":
                    return completeSearchForSet({ useOriginal: commandArg === "SEARCH" })
                default:
                    return []
            }

        case 3: // Second argument of command
            switch (commandArg) {
                case "SEARCH":
                case "search":
                    return completeSearchForMember(args[1], { useOriginal: commandArg === "SEARCH" })

                default:
                    return []
            }
    }
}

function completeSearchForMember(setArg, { useOriginal }) {
    const { enumsByName, enumsById } = getEnums(useOriginal)

    const enumSet = enumsByName[setArg] || enumsById[setArg]

    if (!enumSet) {
        return []
    }

    const memberNames = _.map(_.values(enumSet.members),
        memberKey => memberKey.split(".")[1])

    const memberIds = _.keys(enumSet.members)

    return _.join(_.concat(memberNames, memberIds), " ")

}

function completeSearchForSet({ useOriginal }) {

    const { enumNames, enumIds } = getEnumNamesAndIds(useOriginal)

    return enumNames + " " + enumIds
}

module.exports = { complete }
