const { getEnums, getEnumNamesAndIds } = require("./data")
const _ = require("lodash")

function completeCommands(partialCommand) {

    const commands = ["help", "search", "SEARCH"]

    return filterByPrefixAndJoin(commands, partialCommand)
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
                case "search": {
                    const partialSet = args[1]
                    return completeSearchForSet(partialSet, { useOriginal: commandArg === "SEARCH" })
                }
                default:
                    return ""
            }

        case 3: // Second argument of command
            switch (commandArg) {
                case "SEARCH":
                case "search": {
                    const set = args[1]
                    const partialMember = args[2]
                    return completeSearchForMember(set, partialMember, { useOriginal: commandArg === "SEARCH" })
                }
                default:
                    return ""
            }
        default:
            return ""
    }
}

function completeSearchForMember(setArg, partialMember, { useOriginal }) {

    const { enumsByName, enumsById } = getEnums(useOriginal)

    const enumSet = enumsByName[setArg] || enumsById[setArg]

    if (!enumSet) {
        return []
    }

    const memberNames = _.map(_.values(enumSet.members),
        memberKey => memberKey.split(".")[1])

    const memberIds = _.keys(enumSet.members)

    const allMatches = _.concat(memberIds, memberNames)
    return filterByPrefixAndJoin(allMatches, partialMember)

}

function completeSearchForSet(partialSet, { useOriginal }) {

    const { enumNames, enumIds } = getEnumNamesAndIds(useOriginal)
    const allMatches = (enumNames + " " + enumIds).split(/\s+/)

    return filterByPrefixAndJoin(allMatches, partialSet)
}

function createPrefixPredicate(prefix) {
    return value => _.isUndefined(prefix) || value.startsWith(prefix)
}

function filterByPrefixAndJoin(collection, prefix) {
    return _.chain(collection)
        .filter(createPrefixPredicate(prefix))
        .join(" ")
        .value()
}

module.exports = { complete }
