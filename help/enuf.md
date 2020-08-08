# enuf

*This is prelim documentation for desired state of enuf.*

The enum finder tool, `enuf`, pronounced "enough".

## Synopis

```test
enuf <command>
```

where `<command>` is one of the following

* [lookup](./lookup.md) find a whole or partial set by name or identifier
* [search](./search.md) find sets by searching translated strings

## Language Packs

### The Data Directory

Many of the commands support multiple languages and versions of the enumerations. If no language packs are installed, then the application defaults to the english language pack that come with `enuf`.

Language packs are part of the `enuf.data` package and that is the default location that is searched. However, they can be installed anywhere and found by setting the `ENUF_DATA_DIR` environment variable. If that variable is set then that will be the first location searched.

In order of precedence `enuf` looks in `ENUF_DATA_DIR`, then the installed versions of `enuf.data` and finally it falls back to the single language installed with itself.

The layout of the data directory specified by `ENUF_DATA_DIR` should look like this

```text
data
└── version1
    └── en_US_allEnums.json
    └── en_GB_allEnums.json
    └── ja_JP_allEnums.json
└── version2
    └── en_US_allEnums.json
    └── en_GB_allEnums.json
    └── ja_JP_allEnums.json
```

In other words a folder for each version installed. In each version folder should be one file per supported language. The language files should be prefixed with their respective language code.

To install `enuf.data`:

```bash
npm install @metasys-server/enuf.data
```

Or to update to the latest:

```bash
npm update @metasys-server/enuf.data
```

A package is around 30-40 MB so you may want to be aware of how many versions you have installed.

### Specifying the Language and Version to Use

To specify the version and/or language used for a search use one of the following

* The environment variables `ENUF_LANG` and `ENUF_VERSION`
* The switch `--language` for the language and the switch `--data-version` for the version.

These switches should be specified after the subcommand.

If no language is specified, then `en_US` is assumed. If no version is specifed then the latest version installed is assumed. If no language packs are installed then the default language pack is used.
