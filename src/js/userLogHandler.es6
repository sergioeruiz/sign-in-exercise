/**
 * @class UserLogHandler
 * Handles the user list stored in the localStorage
 */
export default class Log {
    /**
     * Variable name for localStorage
     * @constant
     * @type {String}
     */
    static get LOCALSTORAGE_VARIABLE() {
        return 'userList';
    }
    /**
     * Get/set required
     */
    set userList(value) {
        const list = this.userList;
        list.push(value);
        localStorage.setItem(Log.LOCALSTORAGE_VARIABLE, JSON.stringify(list));
    }

    get userList() {
        return JSON.parse(localStorage.getItem(Log.LOCALSTORAGE_VARIABLE)) || [];
    }
}

