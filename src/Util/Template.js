/**
 * @description Class for resolving templates
 * @author Tobias Kölpin <tobias.koelpin@telekom.de>
 * @date 2023-03-02
 * @class Template
 */
export default class Template {
    /**
     * @description Build and resolve tagged string template
     * @author Tobias Kölpin <tobias.koelpin@telekom.de>
     * @date 2023-03-02
     * @static
     * @param {String[]} strings The splitted string section
     * @param {Array} args The parameter array
     * @return {Function} The template building function
     * @memberof Template
     */
    static build(strings, ...args) {
        /**
         * @description Build the string from the template
         * @author Tobias Kölpin <tobias.koelpin@telekom.de>
         * @date 2023-03-02
         * @param {Array} The template array for replacing the templated string
         * @return {String} The built and replaced string
         */
        return (...values) => {
            const dict = values[values.length - 1] || {};
            const result = [strings[0]];

            args.forEach((arg, idx) => {
                const value = Number.isInteger(arg) ? values[arg] : dict[arg];
                result.push(value, strings[idx + 1]);
            });

            return result.join(``);
        };
    }
}
