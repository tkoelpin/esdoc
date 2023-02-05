# TODOs

## Version 2.0.0 (currently working on)

- [ ] Reducing external dependencies for security reasons
  - [ ] Using mostly the ES-Syntax and NodeJS default modules
  - [ ] Switching to dependencies with no other dependencies (if the previous task is not possible)
- [ ] Reducing code lines and make code more readable / maintainable

### Production Modules

| Name                               | Version     | Publish Date | Dependencies | Description                                                          |
| ---------------------------------- | ----------- | ------------ | ------------ | -------------------------------------------------------------------- |
| cheerio                            | 1.0.0-rc.12 | 2022-06-26   | 7            | Core jQuery designed specifically for the server                     |
| color-logger                       | 0.0.6       | 2016-05-01   | 0            | Colorful Logger                                                      |
| escape-html                        | 1.0.3       | 2015-09-01   | 0            | Escape string for use in HTML                                        |
| babylon                            | 6.18.0      | 2017-08-15   | 0            | A JavaScript parser                                                  |
| babel-generator                    | 6.26.1      | 2018-02-03   | 8            | Turns an AST into code.                                              |
| babel-traverse                     | 6.26.0      | 2017-08-16   | 9            | Maintains the tree state - replacing, removing, and adding nodes     |
| ${\color {red} \textsf{fs-extra}}$ | 11.1.0      | 2022-11-29   | 3            | fs-extra contains methods such as recursive mkdir, copy, and remove. |
| ice-cap                            | 0.0.4       | 2016-05-01   | 2            | Programmable DOM-based HTML template library.                        |
| marked                             | 4.2.12      | 2023-01-14   | 0            | A markdown parser built for speed                                    |
| minimist                           | 1.2.7       | 2022-10-11   | 0            | parse argument options                                               |
| taffydb                            | 2.7.3       | 2016-09-18   | 0            | TaffyDB have database features.                                      |

### Development Modules

| Name                                           | Version | Publish Date | Dependencies | Description                                                   |
| ---------------------------------------------- | ------- | ------------ | ------------ | ------------------------------------------------------------- |
| babel-cli                                      | 6.26.0  | 2017-08-16   | 15           | Babel command line.                                           |
| babel-plugin-istanbul                          | 6.1.1   | 2021-10-16   | 5            | A babel plugin that adds istanbul instrumentation to ES6 code |
| babel-plugin-transform-es2015-modules-commonjs | 6.26.2  | 2018-04-26   | 4            | This plugin transforms ES2015 modules to CommonJS             |
| babel-register                                 | 6.26.0  | 2017-08-16   | 7            | babel require hook                                            |
| codecov                                        | 3.8.3   | 2021-07-19   | 5            | Uploading report to Codecov: https://codecov.io               |
| esdoc-accessor-plugin                          | latest  | 2017-07-30   | 0            | A accessor plugin for ESDoc                                   |
| esdoc-external-ecmascript-plugin               | latest  | 2017-07-30   | 1            | A external ECMAScript plugin for ESDoc                        |
| esdoc-importpath-plugin                        | ^1.0.2  | 2018-04-29   | 0            | A import path plugin for ESDoc                                |
| esdoc-standard-plugin                          | latest  | 2017-07-30   | 11           | A standard plugin for ESDoc                                   |
| esdoc-undocumented-identifier-plugin           | latest  | 2017-07-30   | 0            | A undocumented identifier plugin for ESDoc                    |
| eslint                                         | 8.33.0  | 2023-01-28   | 39           | An AST-based pattern checker for JavaScript.                  |
| mocha                                          | 10.2.0  | 2022-12-11   | 21           | simple, flexible, fun test framework                          |
| nyc                                            | 15.1.0  | 2020-06-01   | 27           | the Istanbul command line interface                           |
