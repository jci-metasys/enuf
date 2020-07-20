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


function completeSearchArgs([partialSetName, partialMemberName]) {

    const { enumsByName } = getEnums()

    if (!partialSetName && !partialMemberName) {
        return _.keys(enumsByName)
    }

    if (partialSetName) {
        const setMatches = _.filter(
            _.keys(enumsByName),
            setName => _.startsWith(_.toLower(setName), _.toLower(partialSetName)),
        )

        if (!partialMemberName) {
            if (setMatches.length === 1 && _.toLower(setMatches[0]) === _.toLower(partialSetName)) {
                const setName = setMatches[0]

                const { members } = enumsByName[setName]

                return _.map(_.values(members), memberKey => memberKey.split(".")[1])
            }
            return setMatches
        } else {
            const setName = setMatches[0]

            const memberNames = _.map(_.values(enumsByName[setName].members),
                memberKey => memberKey.split(".")[1])

            const matches = _.filter(memberNames,
                memberName => _.startsWith(_.toLower(memberName), _.toLower(partialMemberName)),
            )

            if (matches.length === 1 && _.toLower(matches[0]) === _.toLower(partialMemberName)) {
                return []
            }
            return matches
        }
    }
}

module.exports = { complete }
