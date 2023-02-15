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
        0: `[45;97m`,
        1: `[95m`,
        2: `[41;97m`,
        3: `[91m`,
        4: `[43;30m`,
        5: `[93m`,
        6: `[92m`,
        7: `[96m`,
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
        let month = date.getMonth() + 1;
        if (month < 10) month = `0${month}`;
        
        let day = date.getDate();
        if (day < 10) day = `0${day}`;
        
        let hour = date.getHours();
        if (hour < 10) hour = `0${hour}`;
        
        let minutes = date.getMinutes();
        if (minutes < 10) minutes = `0${minutes}`;
        
        let sec = date.getSeconds();
        if (sec < 10) sec = `0${sec}`;

        return `${date.getFullYear()}-${month}-${day} ${hour}:${minutes}:${sec}`;
    }

    /**
         * display log.
         * @param {string} level - log level. v, d, i, w, e.
         * @param {...*} msg - log message.
         * @returns {string} - formatted log message.
         * @private
         */
    #output(level, ...msg) {
        const text = [];

        for (const m of msg) {
            if (typeof m === 'object') text.push(JSON.stringify(m, null, 2));
            else text.push(JSON.stringify(m, null, 2).replace(/(?:^"|"$)/gu, ``));
        }

        const color = this.#color[level] ?? ``;
        const now = this.#formatDateTime(new Date());
        const severity = level < 8 ? ` [${Object.entries(this.#logLevel)[level][0].toUpperCase()}]` : ``;
        const tagName = this.#tagName ?? ``;
        const info = this.#tagName !== null ? ` [${this.#getInfo()}]` : this.#getInfo();

        const log = `${color} ${now}${severity}: ${tagName}${info}: ${text.join(' ')} [0m`;
        
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
}

// const logger = new ColorLogger('TestApplication');
// logger.emerg('An emergency message.');
// logger.alert('An alert message.');
// logger.crit('A critical message.');
// logger.err('An error message.');
// logger.warning('A warning message.');
// logger.notice('A notice message.');
// logger.info('An informational message.');
// logger.debug('A debug message.');
// logger.log('[32mA plain "debuggy \n message" logging message.');

export default new ColorLogger();