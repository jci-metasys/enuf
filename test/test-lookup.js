const { expect } = require("chai")
const { lookup } = require("../lookup")
const colors = require("colors/safe")

/* global it context describe */

// assertions don't work of colors codes are output in tables.
colors.disable()


// The ${""} are only used to keep VS Code from trimming traling white space
const bosetupEnumSetString =
`
Name                               Id   Description                 ${""}
bosetupEnumSet                      2   BO Setup                    ${""}
bosetupEnumSet.bosetupMomentary     0   Momentary                   ${""}
bosetupEnumSet.bosetupMaintained    1   Maintained                  ${""}
bosetupEnumSet.bosetupPulse         2   Pulse                       ${""}
bosetupEnumSet.bosetupStartStop     3   Start Stop`

const BOSETUP_ENUM_SET_STRING =
`
Name                                  Id   Description                 ${""}
BOSETUP_ENUM_SET                       2   BO Setup                    ${""}
BOSETUP_ENUM_SET.BOSETUP_MOMENTARY     0   Momentary                   ${""}
BOSETUP_ENUM_SET.BOSETUP_MAINTAINED    1   Maintained                  ${""}
BOSETUP_ENUM_SET.BOSETUP_PULSE         2   Pulse                       ${""}
BOSETUP_ENUM_SET.BOSETUP_START_STOP    3   Start Stop`

const bosetupEnumSet_bosetupPulseString =
`
Name                          Id   Description                 ${""}
bosetupEnumSet                 2   BO Setup                    ${""}
bosetupEnumSet.bosetupPulse    2   Pulse`

const bosetupEnumSet_bosetupPulse_bosetupStartStop =
`
Name                              Id   Description                 ${""}
bosetupEnumSet                     2   BO Setup                    ${""}
bosetupEnumSet.bosetupPulse        2   Pulse                       ${""}
bosetupEnumSet.bosetupStartStop    3   Start Stop`

const BOSETUP_ENUM_SET_BOSETUP_PULSE =
`
Name                             Id   Description                 ${""}
BOSETUP_ENUM_SET                  2   BO Setup                    ${""}
BOSETUP_ENUM_SET.BOSETUP_PULSE    2   Pulse`

const BOSETUP_ENUM_SET_BOSETUP_PULSE_BOSETUP_START_STOP =
`
Name                                  Id   Description                 ${""}
BOSETUP_ENUM_SET                       2   BO Setup                    ${""}
BOSETUP_ENUM_SET.BOSETUP_PULSE         2   Pulse                       ${""}
BOSETUP_ENUM_SET.BOSETUP_START_STOP    3   Start Stop`

describe("lookup", () => {
    context("lookup bosetupEnumSet", () => {
        it("returns the bosetupEnumSet", () => {
            expect(lookup(["bosetupEnumSet"])).equals(bosetupEnumSetString)
        })

    })

    context("lookup 2", () => {
        it("returns the bosetupEnumSet", () => {
            expect(lookup([2])).equals(bosetupEnumSetString)
        })
    })

    context("lookup BOSETUP_ENUM_SET", () => {
        it("returns the bosetupEnumSet", () => {
            expect(lookup(["BOSETUP_ENUM_SET"])).equals(BOSETUP_ENUM_SET_STRING)
        })
    })

    context("lookup members", () => {
        context("lookup bosetupEnumSet bosetupPulse", () => {
            it("returns one member of bosetupEnumSet", () => {
                expect(lookup(["bosetupEnumSet", "bosetupPulse"])).equals(bosetupEnumSet_bosetupPulseString)
            })
        })

        context("lookup bosetupEnumSet bosetupPulse bosetupStartStop", () => {
            it("returns last two members of bosetupEnumSet", () => {
                expect(lookup(["bosetupEnumSet", "bosetupPulse", "bosetupStartStop"]))
                    .equals(bosetupEnumSet_bosetupPulse_bosetupStartStop)
            })
        })

        context("lookup 2 2", () => {
            it("returns one member of bosetupEnumSet", () => {
                expect(lookup([2, 2])).equals(bosetupEnumSet_bosetupPulseString)
            })
        })

        context("lookup 2 2 3", () => {
            it("returns last two members of bosetupEnumSet", () => {
                expect(lookup([2, 2, 3]))
                    .equals(bosetupEnumSet_bosetupPulse_bosetupStartStop)
            })
        })

        context("lookup BOSETUP_ENUM_SET BOSETUP_PULSE", () => {
            it("returns one member of set", () => {
                expect(lookup(["BOSETUP_ENUM_SET", "BOSETUP_PULSE"]))
                    .equals(BOSETUP_ENUM_SET_BOSETUP_PULSE)
            })
        })

        context("lookup BOSETUP_ENUM_SET BOSETUP_PULSE BOSETUP_START_STOP", () => {
            it("returns one member of set", () => {
                expect(lookup(["BOSETUP_ENUM_SET", "BOSETUP_PULSE", "BOSETUP_START_STOP"]))
                    .equals(BOSETUP_ENUM_SET_BOSETUP_PULSE_BOSETUP_START_STOP)
            })
        })

    })
})