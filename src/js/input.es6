/**
 * @class Input
 * Reusable based for inputs
 */
export default class Input {
    /**
     * @constant
     * @type {string}
     */
    static get FORM_GROUP_ERROR_CLASS() {
        return 'form-el--error';
    }
    /**
     * @constant
     * @type {string}
     */
    static get INPUT_ERROR_SELECTOR() {
        return '.js-input-error';
    }
    /**
     * Create a new component
     * @constructor
     */
    constructor(containerElement, inputSelector = 'input, textarea, select') {
        this._containerElement = containerElement;
        this._inputElement = this._containerElement.querySelector(inputSelector);
        this.bindEvents();
    }

    /**
     * Add the error class and message to the input
     * @param {array} messages - error messages
     */
    error(message = '') {
        this._containerElement.classList.add(Input.FORM_GROUP_ERROR_CLASS);

        const msgContainer = this._containerElement.querySelector(Input.INPUT_ERROR_SELECTOR);

        if (msgContainer) {
            msgContainer.innerHTML = message;
        }
    }
    /**
     * Binds the events to the input
     */
    bindEvents() {
        if (this._inputElement) {
            this._inputElement.addEventListener('blur', this.blurEventHandler.bind(this));
            this._inputElement.addEventListener('keyup', this.keyUpEventHandler.bind(this));
        }
    }
    /**
     * Handle onBlur Event for input field
     */
    blurEventHandler() {
        if (!this.validate()) {
            this.error(this._inputElement.validationMessage);
        } else {
            this.error();
            this._containerElement.classList.remove(Input.FORM_GROUP_ERROR_CLASS);
        }
    }
    /**
     * Handle onFocus Event for input field
     */
    keyUpEventHandler() {
        if (this._containerElement.classList.contains(Input.FORM_GROUP_ERROR_CLASS)) {
            this.blurEventHandler();
        }
    }

    /**
     * Check for input validation
     */
    validate() {
        if (
            (this.required || this._inputElement.getAttribute('pattern')) &&
            !this._inputElement.checkValidity()) {
            this._containerElement.classList.add(Input.FORM_GROUP_ERROR_CLASS);
            return false;
        }
        return true;
    }

    /**
     * Get/set data
     */
    set selectList(data) {
        if (this._inputElement.tagName === 'SELECT') {
            this._inputElement.innerHTML = '';
            data.forEach((option) => {
                if (option.name) {
                    const optionEl = document.createElement('option');
                    this._inputElement.appendChild(optionEl);
                    optionEl.innerHTML = option.name;
                    optionEl.setAttribute('value', option.val || option.name);
                }
            });
        }
    }

    /**
     * Get/set required
     */
    set required(value) {
        this._inputElement.required = value;
    }

    get required() {
        return this._inputElement.required;
    }
}
