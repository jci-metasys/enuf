const { getTranslations } = require("./data")
const _ = require("lodash")

/**
 * Searches each word of each display string in a set and returns true
 * if the set has a matching member for each term. A match is made
 *  if a member has a word in its translation that starts with a term.
 * @param {string} set
 * @param {string[]} terms
 */
function wordPrefixMatch(set, terms) {
    // strip non-alphanumeric chars from display strings

    const displayWords = _.flatMap(_.values(set), display => {
        const alphaNumericDisplay = display.replace(/\W/g, "").toLowerCase()
        return alphaNumericDisplay.split(/\s/)
    })

    return _.every(terms, term =>
        _.some(displayWords, word => word.startsWith(term.toLowerCase())))
}

function matchBasedOnDistinctMatches(set, terms) {
    const matchingTranslations = _.flatMap(terms, term => _.filter(_.values(set), translation =>
        translation.toLowerCase().includes(term.toLowerCase())))
    const uniqueMatches = _.uniq(matchingTranslations)
    return uniqueMatches.length >= terms.length && _.every(terms, term => _.some(_.values(set), translation =>
        translation.toLowerCase().includes(term.toLowerCase())))
}


function search(...terms) {
    var translations = getTranslations()

    var matches = _.pickBy(translations, set => matchBasedOnDistinctMatches(set.oneOf, terms))
    return matches

}

var obj = {
    "oneOf": {
        "0": "1000000ths",
        "1": "100000ths",
        "2": "10000ths",
        "3": "1000ths",
        "4": "100ths",
        "5": "10ths",
        "6": "1s",
        "7": "10s",
        "8": "100s",
        "9": "1000s",
        "10": "10000s",
        "11": "100000s",
        "12": "1000000s"
      }
}

var obj2 = {
    "oneOf": {
        "0": "Inactive",
        "1": "Active",
        "2": "Hold"
      }
}

// var result = matchBasedOnDistinctMatches(obj2.oneOf, ["active", "inact"])
// console.log(result)
var result = search("active", "inactive")
console.log(JSON.stringify(result, null, 2))
console.log(_.keys(result).length)