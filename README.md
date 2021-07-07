# enuf - Enum Lookup

![Node.js CI](https://github.com/michaelgwelch/enuf.js/workflows/Node.js%20CI/badge.svg?event=push)

<!-- cspell:ignoreWord BACPOLARITY bacpolrty mkdir chdir autoload compaudit compinit -->
<!-- cspell:ignoreWord bashcompinit -->

A command line tool for querying Metasys enums. It features auto-completions to make searching quicker with less typing.

![screen capture of enuf](images/enuf-min.gif)

## Prerequisites

* node and npm
* bash or zsh (for completions to work)

The completion scripts are written for bash. The program will still work fine if you aren't using bash or zsh but you won't get auto-completions.

## Installation

Add an entry to your npm config to be able to install packages from GitHub Packages.

```bash
npm config set @metasys-server:registry=https://npm.pkg.github.com
```

Then install the package.

```bash
npm install -g @metasys-server/enuf
```

## Features

* Look up an entire set
* Look up just one member
* Use numeric id or symbolic names for both the set and the member
* Auto-completions (if configured)
* Use new camel case names used in JSON payloads (eg. `attributeEnumSet`) or the original names (eg. `ATTRIBUTE_ENUM_SET`)
* Search for a set based on translated text

### Backlog items

* Multi-Language support
* Ability to update data/languages independently of the app
* Extract the library from the cli so others can write apps with the library

## Usage

```text
usage: enuf <command> [<args>]

These are the commands:

   lookup      Lookup and display a set or partial set
   search      Search for sets containing specified works in translated text

EXAMPLES

  lookup

    The lookup command is invoked like this:

        enuf lookup setArgument [memberArgument...]

    where the setArgument can be a set name or a numeric id. The memberArgument is optional. It can be one or more member names or numeric ids. If memberArgument is missing the entire set is returned, else just the set identifying information along with the specific members is returned.

  search

    The search command is invoked like this:

        enuf search word [word...]

    where word is a word being searched for.
```

See [help](./help/enuf.md) for detailed help

### Examples

#### Searching

Let's say I want to find all the sets with a member that contains "active" and a different member that contains "inactive". (Notice that active can match inactive, our search will look for unique members.)

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

#### Lookup

Let's say I want to see the entire `BACPOLARITY_ENUM_SET`

```bash
> enuf lookup BACPOLARITY_ENUM_SET

Name                 NAME                   Id   Description
bacpolarityEnumSet   BACPOLARITY_ENUM_SET    3   Normal Reverse

Name                 NAME                   Id   Description
bacpolrtyNormal      BACPOLRTY_NORMAL        0   Normal
bacpolrtyReverse     BACPOLRTY_REVERSE       1   Reverse
bacpolrtyHold        BACPOLRTY_HOLD          2   Hold
```

The first two lines describe the set identifiers. Next, comes a table of all of the members of the set.

Next I want to find out what member `5` of the `unitEnumSet` is

```bash
> enuf lookup unitEnumSet 5

Name          NAME             Id   Description
unitEnumSet   UNIT_ENUM_SET   507   Unit

Name          NAME             Id   Description
volts         VOLTS             5   V
```

Now I want to find the `voltAmpereHours` entry in the same set.

```bash
> enuf lookup unitEnumSet voltAmpereHours

Name              NAME                 Id   Description
unitEnumSet       UNIT_ENUM_SET       507   Unit

Name              NAME                 Id   Description
voltAmpereHours   VOLT_AMPERE_HOURS   239   VAh
```

Finally, if all I know about an enum member is the set id and member id I can use those as well

```bash
> enuf lookup 502 2

Name                        NAME                           Id   Description
executionPriorityEnumSet    EXECUTION_PRIORITY_ENUM_SET   502   Execution
                                                                Priority

Name                        NAME                           Id   Description
criticalEquipmentPriority   CRITICAL_EQUIPMENT_PRIORITY     2   Critical
```

Here I'm looking up several enum members based on an xml payload I'm investigating.

```bash

Name                 NAME                           Id   Description
elementNameEnumSet   ELEMENT_NAME_ENUM_SET         514   Element Name

Name                 NAME                           Id   Description
validDays            ELENAM_VALID_DAYS              96   Valid Days
enableInternetConn   ELENAM_ENABLE_INTERNET_CONN   176   Enable Internet
                                                         Connection Sharing
fromTime             ELENAM_FROM_TIME               97   From Time
toTime               ELENAM_TO_TIME                 98   To Time
recChoice            ELENAM_REC_CHOICE             106   Recipient Choice
objId                ELENAM_OBJ_ID                  99   Object ID
recNbr               ELENAM_REC_NBR                100   Address-Net Nbr
recIp                ELENAM_REC_IP                 101   Address-IP
recUdp               ELENAM_REC_UDP                102   Address-UDP Port
procId               ELENAM_PROC_ID                103   Process Identifier
confNotif            ELENAM_CONF_NOTIF             104   Confirmed Notif
transitions          ELENAM_TRANSITIONS            105   Transitions
```

## Configuring Completions

If you configure the completions then you can use the `<tab>` key to see auto-complete suggestions. These work both with bash and zsh.

### Bash

To do that copy the completions file `enuf-completion-bash` to a location in your $HOME directory and source it from your `.bashrc`. I created a new directory in my home directory called `.completions`.

```bash
> cd ~
> mkdir .completions
> chdir .completions
```

The file `enuf-completion.bash` is stored somewhere in your `node.js` configuration files. The easiest way to get it is to just grab it from the repo [here](https://github.jci.com/cwelchmi/enuf/blob/main/enuf-completion.bash). You can copy and paste the contents of that file into a new file. Save it to the directory you just created with the name `enuf-completion.bash`.

Finally edit your `.bashrc` file and add this line at the end. (This should be in your home directory. If it isn't it's safe to create it. If you are using `.profile` instead of `.bashrc` you can add the line there instead)

```bash
source $HOME/.completions/enuf-completion.bash
```

Now every time you start a new shell the completions will be loaded for `enuf`.

### ZSH

Follow the instructions for creating the `enuf-completion.bash` file from previous section and put it in the `.completions` directory.

Then in your `.oh-my-zsh/oh-my-zsh.sh` file find this line

```zsh
autoload -U compaudit compinit
```

Add the following lines right after it

```zsh
autoload -U +X bashcompinit && bashcompinit
# Make sure enuf completions are loaded
source $HOME/.completions/enuf-completion.bash
```

## Example Usage of Completions

This command line tool comes with bash completions to make it easier to find what you are looking for. For example, let's lookup attribute id `3257` from `attributeEnumSet`. In the following example `<tab>` means press the tab key and the `▊` is the cursor.

```bash
> enuf▊<tab>
```

After you type tab the list of commands is shown and the cursor advanced:

```bash
> enuf ▊
help    lookup    search
```

Next, type `l` and then tab:

```bash
> enuf l<tab>▊
```

The command auto-completes and advances the cursor:

```bash
> enuf lookup ▊
```

Now start to type the name of the enum set followed by tab.

```bash
> enuf lookup attr▊<tab>
```

The enum set partially completes

```bash
> enuf lookup attribute▊
```

Now type tab a second time and two suggestions are given

```bash
> enuf lookup attribute▊
attributeCategoryEnumSet  attributeEnumSet
```

If I now type an E followed by a tab

```bash
> enuf lookup attributeE▊<tab>
```

The set will auto-complete and advanced the cursor

```bash
> enuf lookup attributeEnumSet ▊
```

Finally I enter in the id I'm looking for

```bash
> enuf lookup attributeEnumSet 3257

Name               NAME                   Id   Description
attributeEnumSet   ATTRIBUTE_ENUM_SET    509   Attribute

Name               NAME                   Id   Description
input61            INPUT61_ATTR         3257   Input61
```

Then when I hit return I get a table with the results. After the header rows, the next row always includes information about the set itself. Then the next line includes the member I was looking for.

You can even use completions with search:

```bash
> enuf search pres<tab>
pres                 present              press-analog         pressure-brine       pressure|oil
pres/ambient         preserve             press1               pressure-digital     pressurize
pres/rat             preset               press2               pressure-flow        prestart
prescale             preshutdown          pressed              pressure/flow        prestop
presence             press                pressure             pressure|evaporator  presval
```

This shows you all the terms that start with `pres`

## Known Issues

It pains me greatly that their is a slight delay after you type <tab> and the completions happen. On my machine anywhere between 0.15-0.21 seconds (just for the commands. It's longer when it actually needs to do work to search the dictionary). The 0.15-0.2 seconds is the overhead of using node for this application. I created a prototype in C that just returned the list of commands and it was close to 0 (like 0.01s). So it's as snappy as the completions for git.

A rewrite in another language may be in order. Or perhaps I should just write the completions in bash shell scripting (but that seems like a tough job).
