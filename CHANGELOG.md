# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.5.1](https://github.com/digitalinteraction/pdc/compare/v1.5.0...v1.5.1) (2022-06-29)

## [1.5.0](https://github.com/digitalinteraction/pdc/compare/v1.4.0...v1.5.0) (2022-06-29)

### Features

- add filters to paper view ([5c60e73](https://github.com/digitalinteraction/pdc/commit/5c60e73cac9569197ed94affdfa3ff3765fc3b7c))
- add paper detail view ([f1365dc](https://github.com/digitalinteraction/pdc/commit/f1365dcee16f98f50a6843acf64469c9252e7fc9))

### Bug Fixes

- add page guards ([816e989](https://github.com/digitalinteraction/pdc/commit/816e98913646300689d3571c3dd2d13a59ff8d55))
- fix overflowing paper cells ([9f54d45](https://github.com/digitalinteraction/pdc/commit/9f54d45d86a3d8811557cbb4f9e1ff38c5a17229))
- update paper parsing ([ae1c5f9](https://github.com/digitalinteraction/pdc/commit/ae1c5f9199474696bdaa6cdd35e1cbe65da72134))

## [1.4.0](https://github.com/digitalinteraction/pdc/compare/v1.3.0...v1.4.0) (2022-06-27)

### Features

- add wip papers pages ([612053a](https://github.com/digitalinteraction/pdc/commit/612053a7398c608cfaf5d4ed9a597f405df20be1))
- pull papers from notion and serve them ([35b0703](https://github.com/digitalinteraction/pdc/commit/35b0703ea70f199fe3ff52e5fcac351aba39db79))
- rework places page with hierachy ([95faed7](https://github.com/digitalinteraction/pdc/commit/95faed776284a0d4e0c7599bbdc04c5b7f6ae587))
- support dividers from notion blocks ([397efe2](https://github.com/digitalinteraction/pdc/commit/397efe2fae4b4fbac8eabf7596683de2477fe77e))

### Bug Fixes

- don't show html in summaries ([38a1f4b](https://github.com/digitalinteraction/pdc/commit/38a1f4b4c162c7b57fba8a1c8bc3cf78dfe30792))
- fix incorrect place-detail-session-view routing ([95aae3e](https://github.com/digitalinteraction/pdc/commit/95aae3ebfd5fbc48a35eb8ad456329e9a9fd8be2))
- hide add-to-calendar buttons ([c2057f1](https://github.com/digitalinteraction/pdc/commit/c2057f13185a35eebb6cfe56b95ad55c325cb85c))
- hide filters from place-detail-view ([8ab4d8f](https://github.com/digitalinteraction/pdc/commit/8ab4d8f50b08815cce453bd35438ada0de81634d))
- style places cells ([fe3e0e4](https://github.com/digitalinteraction/pdc/commit/fe3e0e41ef9e65c6ae04b6d9b94cc5d7786f664c))

## [1.3.0](https://github.com/digitalinteraction/pdc/compare/v1.2.0...v1.3.0) (2022-06-23)

### Features

- add configurable "readonly" for pages via config + watch config in development ([5e0fa75](https://github.com/digitalinteraction/pdc/commit/5e0fa75bc3e2a80ccfd4fb888715737044f37055))
- add notion embeds ([d5f232c](https://github.com/digitalinteraction/pdc/commit/d5f232c3012d61989c686a45626a083a7b911bb6))
- strip markdown and use fixed deconf-ui ([a2a07b6](https://github.com/digitalinteraction/pdc/commit/a2a07b68874dec02e5f46b5ef658876137ea4711))

### Bug Fixes

- add icon for paper sessions ([0d08e34](https://github.com/digitalinteraction/pdc/commit/0d08e34aa514858175df2e134fe0bb4397f4ce8b))
- improve title parsing ([3553c9c](https://github.com/digitalinteraction/pdc/commit/3553c9cc8794f4d63e1996208cfaf3d69ac5093b))
- stop concurrent migrations with a semaphore ([e2a4a43](https://github.com/digitalinteraction/pdc/commit/e2a4a43e07624d56131fd4fc92cf47377f6143f5))

## [1.2.0](https://github.com/digitalinteraction/pdc/compare/v1.1.0...v1.2.0) (2022-06-22)

### Features

- add places page ([63e4346](https://github.com/digitalinteraction/pdc/commit/63e434678208106c06ca71d4d3aba83d7b6c9695))

## [1.1.0](https://github.com/digitalinteraction/pdc/compare/v1.0.0...v1.1.0) (2022-06-21)

### Features

- add notion-login ([8aa556a](https://github.com/digitalinteraction/pdc/commit/8aa556ae734450d63a87d0703ba83bc0267f0ea8))
- add private calendar to ProfileView ([496484c](https://github.com/digitalinteraction/pdc/commit/496484c2667db45591eeeefa9491d1f0af08cb2a))
- add profile page ([3ffe6b3](https://github.com/digitalinteraction/pdc/commit/3ffe6b3690cfefec9c6723a31abb7780ea215678))

## [1.0.0](https://github.com/digitalinteraction/pdc/compare/v0.2.14...v1.0.0) (2022-06-07)

### [0.2.14](https://github.com/digitalinteraction/pdc/compare/v0.2.13...v0.2.14) (2022-06-07)

### Bug Fixes

- remove vls dev dependency ([46a830f](https://github.com/digitalinteraction/pdc/commit/46a830f96dc952c855657a0aec0b665c00d55eb3))

### [0.2.13](https://github.com/digitalinteraction/pdc/compare/v0.2.12...v0.2.13) (2022-06-07)

### Features

- **cli:** add option to skip fetching files ([5e90457](https://github.com/digitalinteraction/pdc/commit/5e90457046489a6fd64e438d04aefebff99ceba1))

### Bug Fixes

- remove keynotes background ([e8a439b](https://github.com/digitalinteraction/pdc/commit/e8a439b3c691ae38370668e547c76e434ad46465))
- swap newcastle background for keynotes ([36f4f3e](https://github.com/digitalinteraction/pdc/commit/36f4f3e7aaa56657374d7145728b049c8b70cc05))
- update footer acknowledgement ([d521225](https://github.com/digitalinteraction/pdc/commit/d5212258d498cb7ab205896de619b9c2313ea176))

### [0.2.12](https://github.com/digitalinteraction/pdc/compare/v0.2.11...v0.2.12) (2022-06-06)

### Features

- add social links embed ([0e4393f](https://github.com/digitalinteraction/pdc/commit/0e4393f8e452d4ddae66a6d3f8b0f2bf194f4562))

### [0.2.11](https://github.com/digitalinteraction/pdc/compare/v0.2.10...v0.2.11) (2022-06-01)

### [0.2.10](https://github.com/digitalinteraction/pdc/compare/v0.2.9...v0.2.10) (2022-06-01)

### Bug Fixes

- **atrium:** remove title from box-content ([70a67bb](https://github.com/digitalinteraction/pdc/commit/70a67bba96a2d98464aaa4f2d53d8654a8675ca5))

### [0.2.9](https://github.com/digitalinteraction/pdc/compare/v0.2.8...v0.2.9) (2022-06-01)

### Bug Fixes

- **cli:** allow null STATIC_URL when fetching assts ([2dc5761](https://github.com/digitalinteraction/pdc/commit/2dc5761abc227110d6d01d448d0bf865ced0ffb2))

### [0.2.8](https://github.com/digitalinteraction/pdc/compare/v0.2.7...v0.2.8) (2022-06-01)

### [0.2.7](https://github.com/digitalinteraction/pdc/compare/v0.2.6...v0.2.7) (2022-05-31)

### Bug Fixes

- add a11y tag to home logo ([6c6b120](https://github.com/digitalinteraction/pdc/commit/6c6b1205d82a5064752bdd1b1bfd7a7dbcc1e70c))
- add positional artwork ([4ffed61](https://github.com/digitalinteraction/pdc/commit/4ffed610c27350ca3387a11e04608919715c5e53))
- style the active atrium ([5bafd18](https://github.com/digitalinteraction/pdc/commit/5bafd189d6852e15996c14585fa3bae319518751))
- tweak styles ([67f5703](https://github.com/digitalinteraction/pdc/commit/67f5703a07c3d2cde9aee6db3fc82bbbd31d499f))
- update about icon ([bece594](https://github.com/digitalinteraction/pdc/commit/bece5946d40ae9d81cce0132ad40f418454ae4e9))
- update main-brand ([b6ddfa4](https://github.com/digitalinteraction/pdc/commit/b6ddfa4a9cb94ae66cf5048a66e2c8ad391fe663))

### [0.2.6](https://github.com/digitalinteraction/pdc/compare/v0.2.5...v0.2.6) (2022-05-30)

### Features

- **cli:** add option to turn svgs into vue components ([2552188](https://github.com/digitalinteraction/pdc/commit/2552188f6964fa3b5fa71727672d95a95efb3a03))
- update icons and restyle tabs ([ad247a1](https://github.com/digitalinteraction/pdc/commit/ad247a1e119ba778fcbc5df76b075804b6956379))

### [0.2.5](https://github.com/digitalinteraction/pdc/compare/v0.2.4...v0.2.5) (2022-05-30)

### Features

- add STATIC_URL env var ([5cd858f](https://github.com/digitalinteraction/pdc/commit/5cd858f5a49cb8993303be847c623932ddb92902))

### [0.2.4](https://github.com/digitalinteraction/pdc/compare/v0.2.3...v0.2.4) (2022-05-30)

### Features

- add seperate Keynote Sessions route and show cover image if set ([4b8cc36](https://github.com/digitalinteraction/pdc/commit/4b8cc36563aa09cd58a0409ff281322c6c0eee4c))
- **cli:** add 'quiet' option to fetch-schedule ([ede7cf3](https://github.com/digitalinteraction/pdc/commit/ede7cf3490876214a928e359d6bc9d9b35ca5410))
- improve notion parser ([03a8073](https://github.com/digitalinteraction/pdc/commit/03a80738e815cc707c2eba653705835e61aa895d))
- pull cover image from notion ([50ab740](https://github.com/digitalinteraction/pdc/commit/50ab740d5ead2f47e3688cc86fb2aaeb54a99079))

### Bug Fixes

- **notion:** improve markdown generator ([9857ca7](https://github.com/digitalinteraction/pdc/commit/9857ca725f541cb85170717bda0c21c4f00c9205))
- **speaker:** add custom speaker dialog that renders markdown ([fbba12c](https://github.com/digitalinteraction/pdc/commit/fbba12cc945ae8fbe0c7dd818fdf3b48d89dcd89))
- turn of keynote-session pages ([8fc1ae6](https://github.com/digitalinteraction/pdc/commit/8fc1ae6307ea8db898a5c3332b648f92fb4af75e))
- update atrium asset ([6249032](https://github.com/digitalinteraction/pdc/commit/6249032e7d4b6ce93a9f9401042970b42e8f0012))

### [0.2.3](https://github.com/digitalinteraction/pdc/compare/v0.2.2...v0.2.3) (2022-05-25)

### Features

- convert KeynotesView to be a grid ([e3b5b9e](https://github.com/digitalinteraction/pdc/commit/e3b5b9e63eb63385298f9135d081bbe098195d60))

### [0.2.2](https://github.com/digitalinteraction/pdc/compare/v0.2.1...v0.2.2) (2022-05-25)

### Features

- add about page ([88d8844](https://github.com/digitalinteraction/pdc/commit/88d884448695e4fa0a886714ed222e1c90318879))
- add sponsors ([be58897](https://github.com/digitalinteraction/pdc/commit/be588978231d691e07198d45448c888f6ef0d9dd))
- add terms & privacy pages ([c410887](https://github.com/digitalinteraction/pdc/commit/c4108875f82aafe7f5632be869d8ab905e55ca8a))
- **cli:** add "currentColor" option to svg command to configure swapping ([b375824](https://github.com/digitalinteraction/pdc/commit/b375824d37848f4b1d0c81b6aa4a1bc898e0cec8))
- implement RegisterView's redirect ([e993cae](https://github.com/digitalinteraction/pdc/commit/e993cae2013c439e95678646dab389f985ec8edb))

### Bug Fixes

- update About title ([0297a70](https://github.com/digitalinteraction/pdc/commit/0297a70443acd3ff5577ceabc85b7519c8e5efaa))
- update guidelines URL ([ed1d0c8](https://github.com/digitalinteraction/pdc/commit/ed1d0c8f8fa30e3f3927172a871d6274eeecfd93))

### [0.2.1](https://github.com/digitalinteraction/pdc/compare/v0.2.0...v0.2.1) (2022-05-24)

### Bug Fixes

- dynamically import svg library ([26ec29e](https://github.com/digitalinteraction/pdc/commit/26ec29ef898630c6521c4febc0b96adec52c8f72))

## [0.2.0](https://github.com/digitalinteraction/pdc/compare/v0.1.1...v0.2.0) (2022-05-24)

### ⚠ BREAKING CHANGES

- remove papers view

### Features

- add icons ([fb6e817](https://github.com/digitalinteraction/pdc/commit/fb6e81790da97f2bc1c0a745b26b5c220f03dc0b))
- add SVG command to optimize and set currentColor ([8424629](https://github.com/digitalinteraction/pdc/commit/84246297981ff22a9dc18a86468aa4cc5e438623))
- re-add widget logic ([b824f6d](https://github.com/digitalinteraction/pdc/commit/b824f6d7a435b659bf2d75e6efc2ad9f6f437a48))

### Bug Fixes

- fix broken i18n key ([ccb2b0a](https://github.com/digitalinteraction/pdc/commit/ccb2b0ac6559f0dc92ceb3294c85b8a1bd4e71cb))
- fix broken keynotes route guard ([19c88c9](https://github.com/digitalinteraction/pdc/commit/19c88c97e1b84ac457a5f11e626140a8896be3a5))
- keep viewBox in SVGs ([80d8ead](https://github.com/digitalinteraction/pdc/commit/80d8ead43f6815d98a2a1c638af35d7d18286cfd))
- only show the primary brand on mobile ([c16f58f](https://github.com/digitalinteraction/pdc/commit/c16f58f0370aa0fe41263696cfd5a98f9dc8716c))
- remove papers route ([c95f7bd](https://github.com/digitalinteraction/pdc/commit/c95f7bda213c29c846bc2a2422ee5552baeb83dc))
- remove papers view ([af126ea](https://github.com/digitalinteraction/pdc/commit/af126ea670c7aba2a08eb80c5ad82d2c81c1014c))

### [0.1.1](https://github.com/digitalinteraction/pdc/compare/v0.1.0...v0.1.1) (2022-05-20)

### Bug Fixes

- fix crash loading package.json ([be98744](https://github.com/digitalinteraction/pdc/commit/be98744e71b1cace51625e32db06a5d5c9906696))

## [0.1.0](https://github.com/digitalinteraction/pdc/compare/v0.0.2...v0.1.0) (2022-05-20)

Everything is new :tada:
