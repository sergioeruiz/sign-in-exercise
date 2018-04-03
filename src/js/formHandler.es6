import Input from './input.es6';
import Log from './userLogHandler.es6';

export default class FormHandler {
    /**
     * Message class for hiding it
     * @constant
     * @type {String}
     */
    static get MESSAGE_HIDDEN_CLASS() {
        return 'msg--hidden';
    }
    /**
     * New entry class used for animation
     * @constant
     * @type {String}
     */
    static get NEW_ENTRY_CLASS() {
        return 'user-list__entry--new';
    }
    /**
     * New entry selector
     * @constant
     * @type {String}
     */
    static get NEW_ENTRY_SELECTOR() {
        return `.${FormHandler.NEW_ENTRY_CLASS}`;
    }
    /**
     * User list container selector
     * @constant
     * @type {String}
     */
    static get USER_LIST_CONTAINER_SELECTOR() {
        return '.js-user-list';
    }
    /**
     * Selector for each of the form elements (inputs, select)
     * @constant
     * @type {String}
     */
    static get FORM_ELEMENT_SELECTOR() {
        return '.js-form-el';
    }
    /**
     * Submit button selector
     * @constant
     * @type {String}
     */
    static get SUBMIT_ELEMENT_SELECTOR() {
        return '.js-submit';
    }
    /**
     * Message element selector
     * @constant
     * @type {String}
     */
    static get MESSAGE_ELEMENT_SELECTOR() {
        return '.js-msg';
    }
    /**
     * Country list API
     * @constant
     * @type {String}
     */
    static get COUNTRY_API_URL() {
        return 'https://restcountries.eu/rest/v2/all';
    }
    /**
     * Month name array list
     * @constant
     * @type {Array}
     */
    static get MONTH_NAMES() {
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'];
    }
    /**
     * Create a new component
     * @constructor
     */
    constructor() {
        this.form = document.signup;
        this.listContainer = document.querySelector(FormHandler.USER_LIST_CONTAINER_SELECTOR);
        this.log = new Log();

        if (this.form && this.listContainer) {
            this.submit = this.form.querySelector(FormHandler.SUBMIT_ELEMENT_SELECTOR);
            this.msg = this.form.querySelector(FormHandler.MESSAGE_ELEMENT_SELECTOR);
        }
    }

    init() {
        if (this.form && this.listContainer) {
            this.initForm();
            this.bindEvents();
            this.createList();
        } else {
            throw new Error('Some of the elements needed are not present in the document.');
        }
    }

    /**
     * Creates a new instance of Input for each of the form elements
     */
    initForm() {
        const formEl = this.form.querySelectorAll(FormHandler.FORM_ELEMENT_SELECTOR);

        formEl.forEach((el) => {
            const formElement = new Input(el);
            if (el.getAttribute('data-type') === 'countryList') {
                this.fetchCountries(formElement);
            }
        });
    }

    /**
     * Fetch the contries API and fills the select with the result
     * @param {Object} selectInstance - Input/select instance
     */
    fetchCountries(selectInstance) {
        if (selectInstance) {
            fetch(FormHandler.COUNTRY_API_URL)
                .then(data => data.json())
                .then((data) => {
                    const optionList = data.map((el) => {
                        const optionVal = {};
                        optionVal.name = el.name;
                        return optionVal;
                    });

                    selectInstance.selectList = optionList;
                    this.submitState(false);
                })
                .catch(() => {
                    selectInstance.error('Sorry, we got an error trying to get the country list');
                });
        }
    }

    /**
     * Change the disabled state of the submit button
     * @param {Boolean} disabled
     */
    submitState(disabled = true) {
        if (this.submit) {
            this.submit.disabled = disabled;
        }
    }

    /**
     * Initial event listener for the form submission
     */
    bindEvents() {
        this.form.addEventListener('submit', this.onSubmit.bind(this));
    }

    /**
     * On submit events
     * @param {Object} ev - Submit event
     */
    onSubmit(ev) {
        const data = this.getFormData();

        this.displayMessage(data);
        this.removeNewEntryClass();
        this.addLog(data, true);
        this.log.userList = data;
        this.form.reset();

        ev.preventDefault();
    }

    /**
     * Removes the new entry class to allow a new animation on a new submit
     */
    removeNewEntryClass() {
        const newEntries = this.listContainer.querySelectorAll(FormHandler.NEW_ENTRY_SELECTOR);
        newEntries.forEach((el) => {
            el.classList.remove(FormHandler.NEW_ENTRY_CLASS);
            void el.offsetWidth; // Force reflow for re-starting the animation. Otherwise it won't work
        });
    }

    /**
     * Creates an object with the form data
     * @returns {Object} cookie value
     */
    getFormData() {
        const inputs = this.form.elements;
        const obj = {
            name: inputs.name.value,
            lastname: inputs.surname.value,
            country: inputs.country.value,
            birthdayString: inputs.birthday.value,
        };
        return obj;
    }

    /**
     * Display the message and creates the string based on data
     * @param {Object} data - user data
     */
    displayMessage(data) {
        if (this.msg && data) {
            const bd = this.stringToDate(data.birthdayString);
            const yearsOld = this.nextBirthdayAge(bd);

            this.msg.classList.remove(FormHandler.MESSAGE_HIDDEN_CLASS);
            this.msg.innerHTML = `Hello ${data.name} ${data.lastname} from ${data.country}.`;
            this.msg.innerHTML += ` on ${bd.getDate()} of ${FormHandler.MONTH_NAMES[bd.getMonth()]}`;
            this.msg.innerHTML += ` you will have ${yearsOld} years old.`;
        }
    }

    /**
     * Turns a date from String to a Date object
     * @param {String} stringDate - the expected format is DD/MM/YYYY
     * @returns {Object} Date object
     */
    stringToDate(stringDate = '01/01/1970') {
        const dateValue = stringDate
            .split('/')
            .reverse()
            .map((val, i) => ((i === 1) ? parseFloat(val) - 1 : parseFloat(val)));

        return new Date(...dateValue);
    }

    /**
     * Calculates the age on the next birthday
     * @param {Date object} birthday
     * @returns {Number} Age on the next birthday
     */
    nextBirthdayAge(birthday = new Date()) {
        const difDates = new Date(Date.now() - birthday.getTime());
        return Math.abs(difDates.getUTCFullYear() - 1970) + 1;
    }

    /**
     * Adds a new entry to the user list, and adds an event listener to the element
     * @param {Object} data - user data
     */
    addLog(data = {}, newEntry = false) {
        const entryHTML = document.createElement('div');
        entryHTML.innerHTML = `<div class="user-list__entry">` +
            `<span class="user-list__cel user-list__cel--main">${data.name} ${data.lastname}</span>` +
            `<span class="user-list__cel">${data.country}</span>` +
            `<span class="user-list__cel">${data.birthdayString}</span>` +
            `</div>`;
        const addedEntry = this.listContainer.insertBefore(entryHTML.firstChild, this.listContainer.firstChild);

        if (newEntry) {
            addedEntry.classList.add(FormHandler.NEW_ENTRY_CLASS);
        }
        addedEntry.addEventListener('click', this.displayMessage.bind(this, data));
    }

    /**
     * Creates the list based on the data saved on the localStorage
     */
    createList() {
        const list = this.log.userList;

        list.forEach((el) => {
            this.addLog(el);
        });
    }
}
