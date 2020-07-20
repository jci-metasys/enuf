# enul - Enum Lookup

A command line tool for querying Metasys enums. It features auto-completions to make searching quicker with less typing.

## Prerequisites

* node and npm
* bash or zsh (for completions to work)

The completion scripts are written for bash. The program will still work fine if you aren't using bash or zsh but you won't get auto-completions.

## Installation

If you have [jci-gen4-npm-v](https://ses-artifactory.go.johnsoncontrols.com/artifactory/api/npm/jci-gen4-npm-v/) setup as your default registry you can just install directly using npm

```bash
npm install -g enul
```

**Recommended Approach:** Otherwise you can use this lengthier version.

```bash
npm install -g enul --registry=https://ses-artifactory.go.johnsoncontrols.com/artifactory/api/npm/jci-gen4-npm-v/
```

You can also install directly from GitHub Enterprise. First find the latest version by looking at the [releases](https://github.jci.com/cwelchmi/enul/releases). For example, at the time of writing the latest version was v0.1.7

```bash
npm install -g git+https://github.jci.com/cwelchmi/enul.git#v0.1.7
```

## Features

* Look up an entire set
* Look up just one member
* Use numeric id or symbolic names for both the set and the member
* Auto-completions (if configured)

The symbolic names used by this program are the camel case representation of the macros in JCI_MASTER.xml.

For example, `ATTRIBUTE_ENUM_SET` becomes `attributeEnumSet` and `PRESENT_VALUE` becomes `presentValue`.

## Usage

Let's say I want to see the entire `BACPOLARITY_ENUM_SET`

```bash
> enul bacpolarityEnumSet
╔═════════════════════════════════════╤════╤═══════════════════════════╗
║ Name                                │ Id │ Description               ║
╟─────────────────────────────────────┼────┼───────────────────────────╢
║ bacpolarityEnumSet                  │  3 │ Normal Reverse            ║
╟─────────────────────────────────────┼────┼───────────────────────────╢
║ bacpolarityEnumSet.bacpolrtyNormal  │  0 │ Normal                    ║
╟─────────────────────────────────────┼────┼───────────────────────────╢
║ bacpolarityEnumSet.bacpolrtyReverse │  1 │ Reverse                   ║
╟─────────────────────────────────────┼────┼───────────────────────────╢
║ bacpolarityEnumSet.bacpolrtyHold    │  2 │ Hold                      ║
╚═════════════════════════════════════╧════╧═══════════════════════════╝
```

Notice that the first line after the header row always gives information about the set (it's name, id and description).

Next I want to find out what member `5` of the `unitEnumSet` is

```bash
> enul unitEnumSet 5
╔═══════════════════╤═════╤═══════════════════════════╗
║ Name              │  Id │ Description               ║
╟───────────────────┼─────┼───────────────────────────╢
║ unitEnumSet       │ 507 │ Unit                      ║
╟───────────────────┼─────┼───────────────────────────╢
║ unitEnumSet.volts │   5 │ V                         ║
╚═══════════════════╧═════╧═══════════════════════════╝
```

Now I want to find the `voltampers` entry in the same set.

```bash
> enul unitEnumSet voltAmpereHours
╔═════════════════════════════╤═════╤═══════════════════════════╗
║ Name                        │  Id │ Description               ║
╟─────────────────────────────┼─────┼───────────────────────────╢
║ unitEnumSet                 │ 507 │ Unit                      ║
╟─────────────────────────────┼─────┼───────────────────────────╢
║ unitEnumSet.voltAmpereHours │ 239 │ VAh                       ║
╚═════════════════════════════╧═════╧═══════════════════════════╝
```

Finally, if all I know about an enum member is the set id and member id I can use those as well

```bash
> enul 502 2
╔════════════════════════════════════════════════════╤═════╤═══════════════════════════╗
║ Name                                               │  Id │ Description               ║
╟────────────────────────────────────────────────────┼─────┼───────────────────────────╢
║ executionPriorityEnumSet                           │ 502 │ Execution                 ║
║                                                    │     │ Priority                  ║
╟────────────────────────────────────────────────────┼─────┼───────────────────────────╢
║ executionPriorityEnumSet.criticalEquipmentPriority │   2 │ Critical                  ║
╚════════════════════════════════════════════════════╧═════╧═══════════════════════════╝
```

## Configuring Completions

### Bash
That's all great but typing all of those names gets tedious. This is where auto-completions come in to play. Unfortunately they are not configured out of the box. But it doesn't take much to configure them and once you do you can use the tab key to assist you.

To do that copy the completions file `enul-completions-bash` to a location in hour $HOME directory. I created a new directory in my home directory called `.completions`.

```bash
> cd
> mkdir .completions
> chdir .completions
```

The file `enul-completions.bash` is stored somewhere in your `node.js` configuration files. The easiest way to get it is to just grab it from the repo [here](https://github.jci.com/cwelchmi/enul/blob/main/enul-completion-bash). You can copy and paste the contents of that file into a new file. Save it to the directory you just created with the name `enul-completion.bash`.

Finally edit your `.bashrc` file and add this line at the end. (This should be in your home directory. If it isn't it's safe to create it. If you are using `.profile` instead of `.bashrc` you can add the line there instead)

```bash
source $HOME/.completions/enul-completions.bash
```

Now every time you start a new shell the completions will be loaded for `enul`.

### ZSH

Follow the instructions for creating the `enul-completions.bash` file from previous section and put it in the `.completions` directory.

Then in your `.oh-my-zsh/oh-my-zsh.sh` file find this line

```zsh
autoload -U compaudit compinit
```

Add the following lines right after it

```zsh
autoload -U +X bashcompinit && bashcompinit
# Make sure enul completions are loaded
source $HOME/.completions/enul-completion.bash
```



## Example Usage of Completions

This command line tool comes with bash completions to make it easier to find what you are looking for. For example let's lookup attribute id `3257` from `attributeEnumSet`. In the following example `<tab>` means I pressed the tab key for completions

```bash
> enul attri<tab><tab>
```

After this my screen updated to this

```bash
> enul attribute
attributeCategoryEnumSet  attributeEnumSet
```

Next I typed `E`:

```bash
> enul attributeE<tab>
```

And my screen updated to

```bash
> enul attributeEnumSet
```

Finally I enter in the id I'm looking for

```bash
> enul attributeEnum 3257
╔══════════════════════════╤══════╤═══════════════════════════╗
║ Name                     │   Id │ Description               ║
╟──────────────────────────┼──────┼───────────────────────────╢
║ attributeEnumSet         │  509 │ Attribute                 ║
╟──────────────────────────┼──────┼───────────────────────────╢
║ attributeEnumSet.input61 │ 3257 │ Input61                   ║
╚══════════════════════════╧══════╧═══════════════════════════╝
```

Then when I hit return I get a table with the results. After the header row, the next row always includes information about the set itself. Then the next line includes the member I was looking for.

## Case Sensitivity

The application is case insensitive. So the following works

```bash
> enul ATTRIBUTEENUMSET PRESENTVALUE
╔═══════════════════════════════╤═════╤═══════════════════════════╗
║ Name                          │  Id │ Description               ║
╟───────────────────────────────┼─────┼───────────────────────────╢
║ attributeEnumSet              │ 509 │ Attribute                 ║
╟───────────────────────────────┼─────┼───────────────────────────╢
║ attributeEnumSet.presentValue │  85 │ Present Value             ║
╚═══════════════════════════════╧═════╧═══════════════════════════╝
```

However, case sensitivity for auto-completions is trickier. If you use bash you can enable case-insensitive completions by adding the following link to your `~/.inputrc` file:

```bash
set completion-ignore-case On
```

Then the following works:

```bash
> enul AT<tab><tab>
```

Turns into

```bash
>enul at
```

And pressing `<tab>` again shows this

```bash
>enul at
atcFddFaultsEnumSet  atcZncStatesEnumSet  attributeCategoryEnumSet  attributeEnumSet
```

If you use zsh like I do, you're out of luck for now. Just always start your searches with lower case and you'll be fine.
