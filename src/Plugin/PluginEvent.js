function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Plugin Event class.
 */
export default class PluginEvent {
    /**
     * create instance.
     * @param {Object} data - event content.
     */
    constructor(data = {}) {
        this.data = copy(data);
    }
}
