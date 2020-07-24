# enuf-lookup

*This is prelim documentation for desired state of enuf.*

Lookup an enum set or a subset of members of an enum set. (Pronounced "enough").

## Synopsis

```text
enuf lookup [--no-members] [--no-set] [--lang=<lang-id>] [-z]
              <set-descriptor> [<member-descriptor>]...
```

## Description

The lookup command is used to find a specific set or specific members of a set. Set information includes the set name, the set id, member names, member ids and translations for the set and and each member in the requested language (the default is English). Sets actually have two representations for the name. The original SCREAMING_SNAKE_CASE variant and the new camelCase variant. It should be noted that the names used for JSON payloads may vary slightly from the originals in ways other than just casing. (For example all of the members of the attribute enum set have the `ATTR` suffix dropped before camel casing. And `USER_NAME_ATTR` is just `name`).

## Arguments

* `set-descriptor` This argument is required and can be any of the following:

  * A camel case set name (eg. `attributeEnumSet`)
  * An screaming snake case set name (eg. `ATTRIBUTE_ENUM_SET`)
  * A numeric set id (eg. `509`)

  When only a set descriptor is given the command will return the entire enum set including all members, unless the `--no-members` switch is used in which case only the set information itself is returned.

* `member-descriptor` This argument is optional and may occur multiple times. This argument can be any of the following:

  * A camel case member name (eg. `presentValue`)
  * A screaming snake case member name (eg. `PRESENT_VALUE_ATTR`)
  * A numeric member id (eg. `85`)

  When one or more member descriptors are specified then the command returns information for only the specified members rather than returning all members of the set.

## Options

* `--no-members` This option is ignored if any members are specified. Otherwise it is used to restrict the output to set information only. In the following example only the set information for the `attributeEnumSet` is returned.

  ```bash
  > enuf lookup --no-members attributeEnumSet
  name:    attributeEnumSet
  id:      509
  display: Attribute
  ```

* `--no-set` This option restricts the output to only the specified members. If no members are specified no output is generated. The following example returns just the members of the `bosetupEnumSet`.

  ```bash
  > enuf lookup --no-set bosetupEnumSet
  Name                Id   Display
  bosetupMomentary     0   Momentary
  bosetupMaintained    1   Maintained
  bosetupPulse         2   Pulse
  bosetupStartStop     3   Start Stop
  ```

* `-z` Specifies that the output should use the original screaming snake case names.

  ```bash
  > enul lookup -z --no-members attributeEnumSet
  name:    ATTRIBUTE_ENUM_SET
  id:      509
  display: Attribute
  ```

* `--lang=<lang-id>` A language tag like `en-US` to specify the language for the display strings.
