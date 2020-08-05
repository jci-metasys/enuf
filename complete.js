const { getEnums, getEnumSet } = require("./data")
const _ = require("lodash")

function completeCommands(partialCommand) {

    const commands = ["help", "lookup", "search"]

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
                case "lookup": {
                    const partialSet = args[1]
                    return completeSearchForSet(partialSet)
                }
                case "search": {
                    const partialTerm = args[1]
                    return completeSearchForTerm(partialTerm)
                }
                default:
                    return ""
            }


        default: // all other args
            switch (commandArg) {
                case "lookup": {
                    const set = args[1]
                    const partialMember = args[cursorWordPosition - 1]
                    return completeSearchForMember(set, partialMember)
                }
                case "search": {
                    const partialTerm = args[cursorWordPosition - 1]
                    return completeSearchForTerm(partialTerm)
                }
                default:
                    return ""
            }
    }
}

/**
 *
 * @param {*} partialTerm a token in the set of all translation words
 */
function completeSearchForTerm(partialTerm) {
    const enums = getEnums()

    const terms = _.flatMap(enums, set => _.flatMap(_.values(set.members),
        member => _.map(member.display.split(/\s/), word => word.replace(/^[^0-9a-z]*/i, "").replace(/[^0-9a-z]*$/i, "").toLowerCase())))
    const matches = _.filter(terms, term => term.startsWith(partialTerm))
    const result = (_.uniq(matches)).sort()
    return _.join(result, " ")
}

function completeSearchForMember(setArg, partialMember) {

    const enumSet = getEnumSet(setArg)

    if (!enumSet) {
        return []
    }

    if (_.isUndefined(partialMember)) {
        const memberNames = _.map(enumSet.members, member => member.name)
        const memberIds = _.map(enumSet.members, member => member.id)
        const originalNames = _.map(enumSet.members, member => member.originalName)

        const allMatches = _.concat(memberIds, memberNames, originalNames)
        return filterByPrefixAndJoin(allMatches, partialMember)
    }

    if (_.isFinite(parseInt(partialMember, 10))) {
        const memberIds = _.map(enumSet.members, member => member.id)
        return filterByPrefixAndJoin(memberIds, partialMember)
    }

    if (isOriginalName(partialMember)) {
        const originalNames = _.map(enumSet.members, member => member.originalName)
        return filterByPrefixAndJoin(originalNames, partialMember)
    }

    const memberNames = _.map(enumSet.members, member => member.name)
    return filterByPrefixAndJoin(memberNames, partialMember)
}

function isOriginalName(identifier) {
    return !_.isUndefined(identifier) && _.isString(identifier)
        && identifier.length > 0 && (identifier[0] === identifier[0].toUpperCase())
}

function completeSearchForSet(partialSet) {
    const enums = getEnums()

    if (_.isUndefined(partialSet)) {
        const names = _.map(enums, set => set.name)
        const ids = _.map(enums, set => set.id)
        const originalNames = _.map(enums, set => set.originalName)

        const allMatches = _.concat(ids, names, originalNames)
        return filterByPrefixAndJoin(allMatches, partialSet)
    }

    if (_.isFinite(parseInt(partialSet, 10))) {
        const ids = _.map(enums, set => set.id)
        return filterByPrefixAndJoin(ids, partialSet)
    }

    if (isOriginalName(partialSet)) {
        const originalNames = _.map(enums, set => set.originalName)
        return filterByPrefixAndJoin(originalNames, partialSet)
    }

    const names = _.map(enums, set => set.name)
    return filterByPrefixAndJoin(names, partialSet)
}

function createPrefixPredicate(prefix) {
    return value => _.isUndefined(prefix) || _.startsWith(value, prefix)
}

function filterByPrefixAndJoin(collection, prefix) {
    return _.chain(collection)
        .filter(createPrefixPredicate(prefix))
        .sort()
        .join(" ")
        .value()
}

module.exports = { complete }
