const { expect } = require("chai")
const { lookup } = require("../src/lookup")
const colors = require("colors/safe")


// assertions don't work if colors codes are output in tables.
colors.disable()


// The ${""} are only used to keep VS Code from trimming trailing white space
const bosetupEnumSetString =
`
Name                NAME                 Id   Description                                     ${""}
bosetupEnumSet      BOSETUP_ENUM_SET      2   BO Setup                                        ${""}
                                                                                              ${""}
Name                NAME                 Id   Description                                     ${""}
bosetupMomentary    BOSETUP_MOMENTARY     0   Momentary                                       ${""}
bosetupMaintained   BOSETUP_MAINTAINED    1   Maintained                                      ${""}
bosetupPulse        BOSETUP_PULSE         2   Pulse                                           ${""}
bosetupStartStop    BOSETUP_START_STOP    3   Start Stop`

const bosetupEnumSet_bosetupPulseString =
`
Name             NAME               Id   Description                                     ${""}
bosetupEnumSet   BOSETUP_ENUM_SET    2   BO Setup                                        ${""}
                                                                                         ${""}
Name             NAME               Id   Description                                     ${""}
bosetupPulse     BOSETUP_PULSE       2   Pulse`

const bosetupEnumSet_bosetupPulse_bosetupStartStop =
`
Name               NAME                 Id   Description                                     ${""}
bosetupEnumSet     BOSETUP_ENUM_SET      2   BO Setup                                        ${""}
                                                                                             ${""}
Name               NAME                 Id   Description                                     ${""}
bosetupPulse       BOSETUP_PULSE         2   Pulse                                           ${""}
bosetupStartStop   BOSETUP_START_STOP    3   Start Stop`

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
            expect(lookup(["BOSETUP_ENUM_SET"])).equals(bosetupEnumSetString)
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
                    .equals(bosetupEnumSet_bosetupPulseString)
            })
        })

        context("lookup BOSETUP_ENUM_SET BOSETUP_PULSE BOSETUP_START_STOP", () => {
            it("returns one member of set", () => {
                expect(lookup(["BOSETUP_ENUM_SET", "BOSETUP_PULSE", "BOSETUP_START_STOP"]))
                    .equals(bosetupEnumSet_bosetupPulse_bosetupStartStop)
            })
        })

    })
})
