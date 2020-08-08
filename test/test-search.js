const { expect } = require("chai")
const { search } = require("../src/search")

// cspell:ignoreWord nbinarypv nmultistate ntwostate

// These tests all mimic that calling convention that the
// enuf-completion.bash completion script invokes enuf
// The first arg is the index of the word being invoked
// The rest of the args are the args on the command line
// (eg. "lookup attributeEnumSet presentV")

const searchForActiveInactiveResult = `activeInactive2EnumSet
activeInactiveEnumSet
attributeEnumSet
bacEventTypeEnumSet
binarypvEnumSet
enumerationSetNamesEnumSet
inactActFaultEnumSet
inactiveActiveEnumSet
multistateEnumSet
objectStatusEnumSet
ssboPresentValueEnumSet
statusEnumSet
totalizeStatusEnumSet
triggerPresentValueEnumSet
twostateEnumSet`


describe("search", () => {
    context("Search for single multi word term 'no priority'", () => {
        it("return the two matching sets", () => {
            expect(search(["no priority"])).is.equal("objectModeEnumSet\nwritePriorityEnumSet")
        })
    })

    context("Search for active inactive hold", () => {
        it("returns 7 sets", () => {
            expect(search(["active", "inactive"]))
                .is.equal(searchForActiveInactiveResult)
        })
    })


})
