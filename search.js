const { getEnums } = require("./data")
const _ = require("lodash")

/**
 * Checks to see that each predicate is satisfied by a unique value
 * @param {string[]} values
 * @param {predicate[]} predicates
 */
function uniqueValueSatisfiesEachPredicate(values, predicates) {
    if (predicates.length > values.length) return false
    if (values.length === 0) return true
    if (predicates.length === 0) return true
    for (var i = 0; i < values.length; i++) {
        const v = values[i]
        for (var j = 0; j < predicates.length; j++) {
            const p = predicates[j]
            if (p(v)) {
                const values2 = [...values]
                const predicates2 = [...predicates]
                _.pullAt(values2, i)
                _.pullAt(predicates2, j)
                if (uniqueValueSatisfiesEachPredicate(values2, predicates2)) {
                    return true
                }
            }
        }
    }
    return false
}

const stringIncludesTermPredicateCaseInsensitive = term => value => value.toLowerCase().includes(_.toLower(term))

function search(terms) {
    const predicates = _.map(terms, stringIncludesTermPredicateCaseInsensitive)
    const enums = getEnums()
    const sets = _.filter(enums, set =>
        uniqueValueSatisfiesEachPredicate(_.map(set.members, member => member.display), predicates))
    const setNames = _.map(sets, set => set.name).sort()
    _.forEach(setNames, name => console.log(name))
}

module.exports = { search }
