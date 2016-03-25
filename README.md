
![Proto](http://i.imgur.com/CEEbHaw.gif)

> __Proto__ is an extensible program-code-template for creating objects

[![build status][travis_build_status_image]][travis_build_status_url]
[![dependencies status][david_dependencies_status_image]][david_dependencies_status_url]
[![devDependency status][david_devdependencies_status_image]][david_devdependencies_status_url]
[![Codacy Badge][codacy_status_image]][codacy_status_url]
[![License][shields_license_image]][shields_license_url]

<!-- travis -->
[travis_build_status_image]: https://travis-ci.org/adriancmiranda/Proto.svg?branch=master
[travis_build_status_url]: https://travis-ci.org/adriancmiranda/Proto "build status"

<!-- david dependencies -->
[david_dependencies_status_image]: https://david-dm.org/adriancmiranda/Proto.svg?theme=shields.io
[david_dependencies_status_url]: https://david-dm.org/adriancmiranda/Proto "dependencies status"

<!-- david devDependencies -->
[david_devdependencies_status_image]: https://david-dm.org/adriancmiranda/Proto/dev-status.svg?theme=shields.io
[david_devdependencies_status_url]: https://david-dm.org/adriancmiranda/Proto#info=devDependencies "devDependencies status"

<!-- shields.io -->
[shields_license_image]: https://img.shields.io/badge/license-MIT-blue.svg
[shields_license_url]: https://github.com/adriancmiranda/Proto/blob/master/LICENSE.md

<!-- codacy -->
[codacy_status_image]: https://api.codacy.com/project/badge/e40950d046e7483c994400cfe2c5e7a5
[codacy_status_url]: https://www.codacy.com/app/adriancmiranda/Proto

What you need to build your own Proto
-----------------------------------------

In order to build Proto, you need to have the latest node/npm and git 1.7 or later. Earlier versions might work, but are not supported.

For Windows, you have to download and install [git](http://git-scm.com/downloads) and [node](http://nodejs.org/download/).

OS X users should install [git](http://git-scm.com/download).

Linux/BSD users should use their appropriate package managers to install git and node, or build from source
if you swing that way. Easy-peasy.


How to build your own Proto
-------------------------------
Clone a copy of the main Proto git repo by running:

```bash
git clone git://github.com/adriancmiranda/Proto.git
```

Enter the Proto directory and run the install script and the build script:

```bash
cd Proto && npm i && npm run build
```

The built version of Proto will be put in the `dist/` subdirectory, along with the minified copy and associated map file.


Get Started
-----------
### Links to CDN
* [Proto.js](https://rawgit.com/adriancmiranda/Proto/master/dist/Proto.js)
* [Proto.min.js](https://cdn.rawgit.com/adriancmiranda/Proto/master/dist/Proto.min.js)
* [Proto.min.map](https://cdn.rawgit.com/adriancmiranda/Proto/master/dist/Proto.min.map)


### via JSPM
`jspm install adriancmiranda/Proto`

### via Bower
`bower install adriancmiranda/Proto`

### via NPM
`npm install adriancmiranda/Proto`

### via Component
`component install adriancmiranda/Proto`
