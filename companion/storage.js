import { localStorage } from 'local-storage';
import { settingsStorage as ss } from 'settings';

export class TypedStorage {
    constructor(prefix) {
        this.prefix = prefix;
    }

    _k(key) {
        return this.prefix+key;
    }
    get(key) {
        return localStorage.getItem(this._k(key));
    }
    set(key, val) {
        localStorage.setItem(this._k(key), val);
    }
    remove(key) {
        localStorage.removeItem(this._k(key));
    }

    getNumber(key, def) {
        let value = this.get(key);
        return value === null ? def : +value;
    }
}

class SettingsStorage {
    get(key) {
        let value = ss.getItem(key);
        return value === null ? null : JSON.parse(value).name;
    }
    onChange(listener) {
        ss.addEventListener('change', listener);
    }
}

export let settingsStorage = new SettingsStorage();
