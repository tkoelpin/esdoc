import AbstractDoc from './AbstractDoc.js';
import ColorLogger from '../Util/ColorLogger.js';
import ParamParser from '../Parser/ParamParser.js';

/**
 * Doc Class from virtual comment node of external.
 */
export default class ExternalDoc extends AbstractDoc {
  /**
   * apply own tag.
   * @private
   */
  $apply() {
    // super.$apply();

    Reflect.deleteProperty(this.$value, `export`);
    Reflect.deleteProperty(this.$value, `importPath`);
    Reflect.deleteProperty(this.$value, `importStyle`);
  }

  /** specify ``external`` to kind. */
  $kind() {
    // super.#$kind();
    this.$value.kind = `external`;
  }

  /** take out self name from tag */
  $name() {
    const value = this.findTagValue([`@external`]);
    if (!value) {
      ColorLogger.warn(`can not resolve name.`);
    }

    this.$value.name = value;

    const tags = this.findAll([`@external`]);
    if (!tags) {
      ColorLogger.warn(`can not resolve name.`);
      return;
    }

    let name;
    for (const tag of tags) {
      const {typeText, paramDesc} = ParamParser.parseParamValue(tag.tagValue, true, false, true);
      name = typeText;
      this.$value.externalLink = paramDesc;
    }

    this.$value.name = name;
  }

  /** take out self memberof from file path. */
  $memberof() {
    // super.#$memberof();
    this.$value.memberof = this.$pathResolver.filePath;
  }

  /** specify name to longname */
  $longname() {
    // super.#$longname();
    if (this.$value.longname) return;
    this.$value.longname = this.$value.name;
  }

  /** avoid unknown tag */
  $external() {
    // Should not be empty, abstract version?
  }
}
// exports.default = ExternalDoc;
