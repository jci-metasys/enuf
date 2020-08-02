# enuf-search

*This is prelim documentation for desired state of enuf.*

Search for sets that contain specified terms in their translated strings.

## Synopsis

```text
enuf search <word>...
```

## Description

The search command is used to find the names of sets that contain all the words specified on the command line. The output is an alphabetical list of names of sets that match the query. Example:

```bash
> enuf search active inactive
activeInactive2EnumSet
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
twostateEnumSet
```

### Each Word Must Match a Unique Member

For a set to match the search query, it must have a unique member for each word specified.

For example if the following search was performed

```bash
enuf search no priority
```

If you wish to count multiple words as a single search term you must use quotation marks.

```bash
> enuf search "no priority"
objectModeEnumSet
writePriorityEnumSet
```

### Case Insensitive

The search is case insensitive. This can be seen by inspecting some of the sets from the queries in the previous section.

```bash
> enuf lookup activeInactive2EnumSet
Name                                    Id   Description
activeInactive2EnumSet                1695   Active/Inactive
activeInactive2EnumSet.omd2Active        0   Active
activeInactive2EnumSet.omd2Inactive      1   Inactive
```

Although we looked for "inactive" and "active", the `activeInactive2EnumSet` matched because the search is case insensitive.

## Completions

The search command offers lower case completions only. Since the search is case insensitive this still allows you to comlete on any matching terms. In the following example `<tab>` means to type the tab key.

```bash
enuf search prese<tab>
```

This shows the following suggestions

```bash
> enuf search prese
presence  present   preserve  preset
```

## Advanced

It is hoped that the `enuf` command will compose well with itself and other commands. For example, after doing a search you may want to see a little more info about the set. The following command will do a lookup on each found set and display the first six lines of output for each lookup (This will include a blank row, the header row, the set row, and the first three members). (Some sets have been removed from the output and some have been reformatted so they are all the same width.)

```bash
> enuf search active inactive hold | xargs -n1 -- bash -c 'enuf lookup $0 | head -6'


Name                             Id   Description
activeInactiveEnumSet            69   Active Inactive
activeInactiveEnumSet.0           0   Active
activeInactiveEnumSet.1           1   Inactive
activeInactiveEnumSet.2           2   Hold

Name                             Id   Description
binarypvEnumSet                   6   Inactive Active
binarypvEnumSet.bacbinInactive    0   Inactive
binarypvEnumSet.bacbinActive      1   Active
binarypvEnumSet.bacbinHold        2   Hold
```

## Future

Likely the search terms will eventually follow a subset of the rules of `grep` so that regular expressions can be used and case insensitive or case sensitive searches can be done.