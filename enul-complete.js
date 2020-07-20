const { getEnums } = require("./data")
const _ = require("lodash")

function complete([partialSetName, partialMemberName]) {

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