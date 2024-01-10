#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const _ = require("lodash")

// This script does some sanity checking on the supplied data set ./data/_allSEts.json

// 1. Ensure no duplicate member names within a set. If there are this indicates an upstream issue
//    that needs to be resolved.

const parentDir = path.dirname(__dirname)
const dataFileName = path.join(parentDir, "data", "_allSets.json")
const allEnums = JSON.parse(fs.readFileSync(dataFileName, { encoding: "utf8" }))


// Finds duplicate member names in a set.
function findDuplicates(set) {
    const duplicates = _.chain(set.members)
        .map(member => member.name)
        .sort()
        .countBy() // groups by name, and then counts how many with each name
        .pickBy(count => count > 1) // these are the ones that are duplicates
        .keys()
        .value()

    if (duplicates.length > 0) {
        return duplicates
    }

}

var noDuplicates = true

_.forEach(allEnums, enumSet => {
    const duplicates = findDuplicates(enumSet)
    if (duplicates) {
        noDuplicates = false
        console.log(`Duplicates for '${enumSet.name}: ${JSON.stringify(duplicates, null, 2)}`)
    }
})

if (!noDuplicates) {

    // Fix duplicates the way production does by appending `_{numeric id}`
    _.forEach(allEnums, enumSet => {
        const duplicates = findDuplicates(enumSet)
        if (duplicates) {

            _.forEach(duplicates, name => {
                const membersWithName = _.filter(enumSet.members, member => member.name === name)
                _.forEach(membersWithName, member => {
                    member.name = `${member.name}_${member.id}`
                })
            })
        }
    })
    const repairedFileName = path.join(parentDir, "data", "_allSets.no-duplicates.json")
    fs.writeFileSync(repairedFileName, JSON.stringify(allEnums, null, 2))
    console.log(`A version with no duplicates has been created at ${repairedFileName}`)
}




if (!noDuplicates) {
    // A non zero exit code indicates error.
    process.exit(1)
}
