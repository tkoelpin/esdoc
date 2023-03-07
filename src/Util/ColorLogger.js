// https://en.wikipedia.org/wiki/ANSI_escape_code#Colors

/**
 * A colorful logger for the console output
 *
 * format:
 * ``Time [LogLevel]: File: log text``
 *
 * format with tag:
 * ``Time [LogLevel]: Tag [File]: log text``
 *
 * log level and color:
 * - verbose: purple
 * - debug: blue
 * - info: green
 * - warning: yellow
 * - error: red
 *
 * @export
 * @class ColorLogger
 * @example
 * import Logger from 'ColorLogger'
 *
 * // simple usage
 * Logger.notice('notice log');
 *
 * // tag usage
 * let logger = new Logger('MyTag');
 * logger.debug('debug log');
 */
export class ColorLogger {
    #color = Object.freeze({
        0: `\u{001b}[45;97m`,
        1: `\u{001b}[95m`,
        2: `\u{001b}[41;97m`,
        3: `\u{001b}[91m`,
        4: `\u{001b}[43;30m`,
        5: `\u{001b}[93m`,
        6: `\u{001b}[92m`,
        7: `\u{001b}[96m`,
        8: null
    });

    #logLevel = Object.freeze({
        emerg: 0,
        alert: 1,
        crit: 2,
        err: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7,
        default: 8
    });

    #shortMonths = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

    #regEx = Object.freeze({
        rgb: /^(?:(?:[1-9]?\d|1\d{2}|2(?:[0-4]\d|5[0-5]))(?:;(?:[1-9]?\d|1\d{2}|2(?:[0-4]\d|5[0-5]))){2}(?:-(?:[1-9]?\d|1\d{2}|2(?:[0-4]\d|5[0-5]))(?:;(?:[1-9]?\d|1\d{2}|2(?:[0-4]\d|5[0-5]))){2})?|-(?:[1-9]?\d|1\d{2}|2(?:[0-4]\d|5[0-5]))(?:;(?:[1-9]?\d|1\d{2}|2(?:[0-4]\d|5[0-5]))){2})$/
    });

    #tagName;

    /**
     * Creates an instance of ColorLogger.
     *
     * @memberof ColorLogger
     */
    constructor(tagName = null) {
        this.#tagName = tagName;
    }

    set tagName(tagName) {
        this.#tagName = tagName;
    }

    showColorTable() {
        let i, j;

        for (i = 0; i < 11; i++) {
            const list = [];

            for (j = 0; j < 10; j++) {
                const n = 10 * i + j;
                if (n > 108) break;
                const paddedNum = n.toString().padStart(3);
                list.push(`\u{001b}[${n}m ${paddedNum} \u{001b}[0m`);
            }

            console.log(list.join(` `));
        }
    }

    /**
     * Get the information where the log was called.
     *
     * @returns {String} The called file name and its line number
     * @private
     */
    #getInfo() {
        let info;

        try {
            throw new Error();
        } catch (e) {
            const lines = e.stack.split('\n');
            const line = lines[4];
            const matched = line.match(/([\w\d\-_.]*:\d+:\d+)/);
            info = matched[1];
        }

        return info;
    }

    /**
     * Get a formatted date time string from a plain Date object
     *
     * @param {Date} date The Date object which date should be formatted
     * @returns {String} The formatted date time string
     * @private
     */
    #formatDateTime(date) {
        const year = date.getFullYear();
        const monthShort = this.#shortMonths[date.getMonth()];
        const month = (date.getMonth() + 1).toString().padStart(2, `0`);
        const day = date.getDate().toString().padStart(2, `0`);
        const hour = date.getHours().toString().padStart(2, `0`);
        const minutes = date.getMinutes().toString().padStart(2, `0`);
        const sec = date.getSeconds().toString().padStart(2, `0`);

        // return `${year}-${month}-${day} ${hour}:${minutes}:${sec}`;
        return `${monthShort} ${day} ${hour}:${minutes}:${sec}`;
    }

    #convertColor(color) {
        let convertedColor = null;

        if (color.match(this.#regEx.rgb)) {
            let foreground = null;
            let background = null;

            if (color.includes(`-`)) [foreground, background] = color.split(`-`);
            else foreground = color;

            foreground = foreground !== null ? `\u{001b}[38;2;${foreground}m` : ``;
            background = background !== null ? `\u{001b}[48;2;${background}m` : ``,

            convertedColor = foreground + background;
        }

        return convertedColor;
    }

    /**
         * display log.
         * @param {string} level - log level. v, d, i, w, e.
         * @param {...*} msg - log message.
         * @returns {string} - formatted log message.
         * @private
         */
    #output(level, ...msg) {
        const color = this.#color[level] ?? ``;
        const now = this.#formatDateTime(new Date());
        const severity = level < 8 ? ` [${Object.entries(this.#logLevel)[level][0].toUpperCase()}]` : ``;
        const tagName = this.#tagName ?? ``;
        const info = this.#tagName !== null ? ` [${this.#getInfo()}]` : this.#getInfo();
        const text = [];

        for (const m of msg) {
            if (typeof m === 'object') text.push(JSON.stringify(m, null, 2));
            else text.push(JSON.stringify(m, null, 2).replace(/(?:^"|"$)/gu, ``));
        }

        const log = `${color} ${now}${severity}: ${tagName}${info}: ${text.join(' ')} \u{001b}[0m`;

        console.log(log);
    }

    #newOutput({level = null, color = null, msg} = {}) {
        console.log(`Level: ${level}\nColor: ${color}\nMsg:`, msg, `\n`);

        const logColor = color !== null ? this.#convertColor(color) : ``;
        const now = this.#formatDateTime(new Date());
        const severity = level !== null && level < 8 ? ` [${Object.entries(this.#logLevel)[level][0].toUpperCase()}]` : ``;
        const tagName = this.#tagName ?? ``;
        const info = this.#tagName !== null ? ` [${this.#getInfo()}]` : this.#getInfo();
        const text = [];

        for (const m of msg) {
            if (typeof m === 'object') text.push(JSON.stringify(m, null, 2));
            else text.push(JSON.stringify(m, null, 2).replace(/(?:^"|"$)/gu, ``));
        }

        const log = `${logColor} ${now}${severity}: ${tagName}${info}: ${text.join(' ')} \u{001b}[0m`;

        console.log(log);
    }

    /**
     * Display an emergency message to the console output
     * Foreground: Bright White
     * Background: Red
     *
     * @param {*} msg The log message
     * @return {String} The formatted log message
     * @memberof ColorLogger
     */
    emerg(...msg) { return this.#output(this.#logLevel.emerg, ...msg); }

    /**
     * Display an alert message to the console output
     * Foreground: Bright Red
     *
     * @param {*} msg The log message
     * @return {String} The formatted log message
     * @memberof ColorLogger
     */
    alert(...msg) { return this.#output(this.#logLevel.alert, ...msg); }

    /**
     * Display a critical message to the console output
     * Foreground: Bright White
     * Background: Magenta
     *
     * @param {*} msg The log message
     * @return {String} The formatted log message
     * @memberof ColorLogger
     */
    crit(...msg) { return this.#output(this.#logLevel.crit, ...msg); }

    /**
     * Display an error message to the console output
     * Foreground: Bright Magenta
     *
     * @param {*} msg The log message
     * @return {String} The formatted log message
     * @memberof ColorLogger
     */
    err(...msg) { return this.#output(this.#logLevel.err, ...msg); }

    /**
     * Display a warning message to the console output
     * Foreground: Black
     * Background: Bright Yellow
     *
     * @param {*} msg The log message
     * @return {String} The formatted log message
     * @memberof ColorLogger
     */
    warning(...msg) { return this.#output(this.#logLevel.warning, ...msg); }

    /**
     * Display a notice message to the console output
     * Foreground: Bright Yellow
     *
     * @param {*} msg The log message
     * @return {String} The formatted log message
     * @memberof ColorLogger
     */
    notice(...msg) { return this.#output(this.#logLevel.notice, ...msg); }

    /**
     * Display an info message to the console output
     * Foreground: Bright Green
     *
     * @param {*} msg The log message
     * @return {String} The formatted log message
     * @memberof ColorLogger
     */
    info(...msg) { return this.#output(this.#logLevel.info, ...msg); }

    /**
     * Display a debug message to the console output
     * Foreground: Bright Cyan
     *
     * @param {*} msg The log message
     * @return {String} The formatted log message
     * @memberof ColorLogger
     */
    debug(...msg) { return this.#output(this.#logLevel.debug, ...msg); }

    /**
     * Display a log message (plain text) to the console output
     *
     * @param {*} msg The log message
     * @return {String} The formatted log message
     * @memberof ColorLogger
     */
    log(...msg) { return this.#output(this.#logLevel.default, ...msg); }

    // rgbLog(color, ...msg) { return this.#newOutput({color, msg}); }
}

// Check RGB
// R:G:B
// or convert from Hex to RGB

// const logger = new ColorLogger('TestApplication');
// logger.rgbLog('-0;255;0', 'What?', 'It should work', 'Even with more Data.')
// logger.showColorTable();

export default new ColorLogger();