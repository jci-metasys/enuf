const { getEnums } = require("./data")
const _ = require("lodash")

function startsWithMatcher(searchPattern, value, options) {
    const caseSensitive = !options || _.isUndefined(options.caseSensitive) ? true : false
    const searchFor = caseSensitive ? searchPattern : _.toLower(searchPattern)
    const searched = caseSensitive ? value : _.toLower(value)

    return _.startsWith(searched, searchFor)
}

function completeCommands(partialCommand) {

    const commands = ["help", "search"]

    if (!_.isUndefined(partialCommand)) {
        const matches = _.filter(commands, command => startsWithMatcher(partialCommand, command))
        return matches
    }

    return commands
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
                case "search":
                    return completeSearchForSet(args[1])
                default:
                    return []
            }

        case 3: // Second argument of command
            switch (commandArg) {
                case "search":
                    return completeSearchForMember(args[1], args[2])

                default:
                    return []
            }
    }
}

function completeSearchForMember(setArg) {

    const { enumsByName, enumsById } = getEnums()

    const enumSet = enumsByName[setArg] || enumsById[setArg]

    if (!enumSet) {
        return []
    }

    const memberNames = _.map(_.values(enumSet.members),
        memberKey => memberKey.split(".")[1])

    const memberIds = _.keys(enumSet.members)

    return _.concat(memberNames, memberIds)

}


function completeSearchForSet() {

    const { enumsByName, enumsById } = getEnums()

    return _.concat(_.keys(enumsByName), _.keys(enumsById))
}

module.exports = { complete }
