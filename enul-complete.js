const { getEnums } = require("./data")
const _ = require("lodash")

function startsWithMatcher(searchPattern, value, options) {
    const caseSensitive = !options || _.isUndefined(options.caseSensitive) ? true : false
    const searchFor = caseSensitive ? searchPattern : _.toLower(searchPattern)
    const searched = caseSensitive ? value : _ .toLower(value)

    return _.startsWith(searched, searchFor)
}

function completeCommands(partialCommand) {

    const commands = ["help", "search"]

    if (partialCommand) {
        const matches = _.filter(commands, command => startsWithMatcher(partialCommand, command))
        return matches
    }

    return commands
}

function complete(args) {
    // At this level these are the options
    // 1. No args passed (then return all commands)
    // 2. A partial command is entered (then return matches)
    // 3. A full command is entered then do completions for that command

    if (args.length === 0) {
        return completeCommands()
    } else if (args.length >= 1) {
        const partialCommand = args[0]
        const commands = completeCommands(partialCommand)
        if (commands.length === 1 && commands[0] === partialCommand) {
            const command = partialCommand
            if (command === "search") {
                return completeSearchArgs(args.slice(1))
            } else {
                return []
            }
        } else {
            return commands
        }
    }
}

function completeSearchMembers(enumsByName, setName, partialMemberName) {

    const memberNames = _.map(_.values(enumsByName[setName].members),
        memberKey => memberKey.split(".")[1])

    const noFilter = _.isUndefined(partialMemberName)

    const matches = _.filter(memberNames,
        memberName =>  noFilter || _.startsWith(_.toLower(memberName), _.toLower(partialMemberName)),
    )

    if (matches.length === 1 && _.toLower(matches[0]) === _.toLower(partialMemberName)) {
        return []
    }
    return matches
}


function completeSearchArgs([partialSetName, partialMemberName]) {

    const { enumsByName, enumsById } = getEnums()

    if (_.isUndefined(partialSetName) && _.isUndefined(partialMemberName)) {
        return _.keys(enumsByName)
    }

    if (!_.isUndefined(partialSetName)) {

        const setMatches = _.isNumber(partialSetName)
            ? enumsById[partialSetName] ? [enumsById[partialSetName].name] : []
            : _.filter(
                _.keys(enumsByName),
                setName => _.startsWith(_.toLower(setName), _.toLower(partialSetName)),
            )

        if (_.isUndefined(partialMemberName)) {
            if (setMatches.length === 1 &&
                (_.isNumber(partialSetName) || (_.toLower(setMatches[0]) === _.toLower(partialSetName)))) {
                const setName = setMatches[0]

                return completeSearchMembers(enumsByName, setName, partialMemberName)
            }
            return setMatches
        } else {
            if (setMatches.length > 1) {
                return []
            }
            const setName = setMatches[0]
            return completeSearchMembers(enumsByName, setName, partialMemberName)
        }
    }
}

module.exports = { complete }
