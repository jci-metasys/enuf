const { expect } = require("chai")
const { complete } = require("../complete")

/* global context it describe */

// These tests all mimic that calling convention that the
// enuf-completion.bash completion script invokes enuf
// The first arg is the index of the word being invoked
// The rest of the args are the args on the command line
// (eg. "lookup attributeEnumSet presentV")

describe("complete", () => {
    context("no input", () => {
        it("returns all commands", () => {
            expect(complete([1])).to.equal("help lookup search")
        })
    })

    context("commands", () => {
        context("start of help is entered", () => {
            it("returns just 'help'", () => {
                expect(complete([1, "he"])).to.equal("help")
            })
        })

        context("start of lookup is entered", () => {
            it("returns just 'lookup'", () => {
                expect(complete([1, "l"])).to.equal("lookup")
            })
        })

        context("start of search is entered", () => {
            it("returns just 'search'", () => {
                expect(complete([1, "s"])).to.equal("search")
            })
        })
    })

    context("Lookup completions for sets", () => {

        context("No input given", () => {
            it("returns all sets", () => {
                expect(complete([2, "lookup"])).length.greaterThan(10000)
            })
        })
        context("partial camel case set name given", () => {
            context("input: attribute", () => {
                it("returns attributeCategoryEnumSet and attributeEnumSet", () => {
                    expect(complete([2, "lookup", "attribute"])).to.equal("attributeCategoryEnumSet attributeEnumSet")
                })
            })

            context("input: attributeEnum", ()=> {
                it("returns attributeEnumSet", () => {
                    expect(complete([2, "lookup", "attributeEnum"])).to.equal("attributeEnumSet")
                })
            })
        })

        context("partial numeric id given", () => {
            context("input: 50", () => {
                it("returns 50 500 501 502 503 504 505 506 507 508 509", () => {
                    expect(complete([2, "lookup", 50])).to.equal("50 500 501 502 503 504 505 506 507 508 509")
                })
            })

            context("input: 507", () => {
                it("returns 507", () => {
                    expect(complete([2, "lookup", 507])).to.equal("507")
                })
            })
        })

        context("partial screaming case name", () => {
            context("input: RELIABILITY", () => {
                it("returns RELIABILITY_CHECK_MODE_ENUM_SET  RELIABILITY_ENUM_SET", () => {
                    expect(complete([2, "lookup", "RELIABILITY"])).to.equal("RELIABILITY_CHECK_MODE_ENUM_SET RELIABILITY_ENUM_SET")
                })
            })

            context("input RELIABILITY_E", () => {
                it("returns RELIABILITY_ENUM_SET", () => {
                    expect(complete([2, "lookup", "RELIABILITY_E"])).to.equal("RELIABILITY_ENUM_SET")
                })
            })
        })



    })

    context("Lookup completions for members", () => {
        context("set: attributeEnumSet", () => {
            context("input: presentValue", () => {
                it("returns presentValue presentValueEwma presentValueText presentValueWritable", () => {
                    expect(complete([3, "lookup", "attributeEnumSet", "presentValue"])).to.equal(
                        "presentValue presentValueEwma presentValueText presentValueWritable"
                    )
                })
            })

            context("first member is presentValue, secomd member starts with presentValueE", () => {
                it("returns presentValueEwma", () => {
                    expect(complete([4, "lookup", "attributeEnumSet", "presentValue", "presentValueE"]))
                        .to.equal("presentValueEwma")
                })
            })


        })

        context("set: ATTRIBUTE_ENUM_SET", () => {

            context("input: PRESENT_VALUE", () => {
                it("returns PRESENT_VALUE_ATTR PRESENT_VALUE_EWMA_ATTR PRESENT_VALUE_TEXT_ATTR PRESENT_VALUE_WRITABLE_ATTR", () => {
                    expect(complete([3, "lookup", "ATTRIBUTE_ENUM_SET", "PRESENT_VALUE"])).to.equal(
                        "PRESENT_VALUE_ATTR PRESENT_VALUE_EWMA_ATTR PRESENT_VALUE_TEXT_ATTR PRESENT_VALUE_WRITABLE_ATTR"
                    )
                })
            })

            context("first member is PRESENT_VALUE_ATTR, secomd member starts with PRESENT_VALUE_E", () => {
                it("returns PRESENT_VALUE_EWMA_ATTR", () => {
                    expect(complete([4, "lookup", "ATTRIBUTE_ENUM_SET", "PRESENT_VALUE_ATTR", "PRESENT_VALUE_E"]))
                        .to.equal("PRESENT_VALUE_EWMA_ATTR")
                })
            })

        })
    })
})

