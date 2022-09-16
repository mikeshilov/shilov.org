var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const idBase = 1654885500000;
const indexKey = "_index";
const deletedKey = "_deleted";
class Storage {
    setItem(name, obj) {
        obj._modified = Date.now();
        localStorage.setItem(name, JSON.stringify(obj));
        this.updateIndex(name);
        this.updateSnapshot();
    }
    updateNote(noteId, o, e, k) {
        this.setItem(noteId !== null && noteId !== void 0 ? noteId : `note:${Date.now() - idBase}`, e
            ? { 'o': o, 'e': enc(e, k), 'h': window.SparkMD5.ArrayBuffer.hash(encoder.encode(e), false) }
            : { 'o': o });
    }
    decText(e, k, h) {
        const text = dec(e, k);
        const h2 = window.SparkMD5.ArrayBuffer.hash(encoder.encode(text), false);
        return h2 === h ? text : undefined;
    }
    updateList(name, id, remove = false) {
        var _a;
        let list = (_a = localStorage.getItem(name)) !== null && _a !== void 0 ? _a : '';
        const item = ` ${id} `;
        if (list.indexOf(item) === -1) {
            if (!remove) {
                list += item;
            }
        }
        else if (remove) {
            list = list.replace(item, '');
        }
        list = list.replaceAll('    ', '  ');
        localStorage.setItem(name, list);
    }
    updateIndex(id, remove = false) {
        this.updateList(indexKey, id, remove);
    }
    updateDeleted(id, remove = false) {
        this.updateList(deletedKey, id, remove);
    }
    isIdDeleted(id) {
        var _a;
        return ((_a = localStorage.getItem(deletedKey)) !== null && _a !== void 0 ? _a : '').indexOf(` ${id} `) >= 0;
    }
    deleteItem(id) {
        this.updateIndex(id, true);
        this.updateDeleted(id);
        localStorage.removeItem(id);
        this.updateSnapshot();
    }
    *items(categories = null) {
        for (const key of this.allIds()) {
            for (const cat of categories !== null && categories !== void 0 ? categories : [null]) {
                if (cat === null || key.trim().indexOf(`${cat}:`) === 0) {
                    yield { id: key, obj: JSON.parse(localStorage.getItem(key)) };
                }
            }
        }
    }
    allIds(deleted = false) {
        var _a;
        return ((_a = localStorage.getItem(deleted ? deletedKey : indexKey)) !== null && _a !== void 0 ? _a : '').split(' ').map(id => id.trim()).filter(id => id.length);
    }
    getSnapshot() {
        let snapshot = localStorage.getItem('_snapshot');
        if (snapshot === null) {
            this.updateSnapshot();
            snapshot = localStorage.getItem('_snapshot');
        }
        return snapshot;
    }
    updateSnapshot() {
        return localStorage.setItem('_snapshot', this.calculateSnapshot());
    }
    sync() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let resp = yield this.sendApiRequest({});
            if (resp['error'])
                return resp['error'];
            const serverSnapshot = (_a = resp['snapshot']) !== null && _a !== void 0 ? _a : "";
            if (serverSnapshot !== this.getSnapshot()) {
                const itemIdsToGet = [];
                const itemsToSend = [];
                const serverIds = [];
                resp = yield this.sendApiRequest({ "command": "getAllItemSummary", "deletedItemIds": this.allIds(true) });
                if (resp['error'])
                    return resp['error'];
                // iterate through server items
                for (let serverItem of resp['itemSummary']) {
                    const id = serverItem['id'];
                    const isDeletedLocally = this.isIdDeleted(id);
                    if (parseInt(serverItem['deleted'])) {
                        if (!isDeletedLocally) {
                            this.deleteItem(id);
                        }
                    }
                    else {
                        const localValue = localStorage.getItem(id);
                        serverIds.push(id);
                        if (!isDeletedLocally) {
                            if (localValue === null) {
                                itemIdsToGet.push(id);
                            }
                            else {
                                const localItem = JSON.parse(localValue);
                                const serverItemModified = parseInt(serverItem['modified']);
                                if (localItem._modified < serverItemModified) {
                                    itemIdsToGet.push(id);
                                }
                                else if (localItem._modified > serverItemModified) {
                                    itemsToSend.push({ id, value: localItem });
                                }
                            }
                        }
                    }
                }
                // iterate through new local items
                for (const id of this.allIds().filter(id => serverIds.indexOf(id) < 0)) {
                    itemsToSend.push({ id, value: JSON.parse(localStorage.getItem(id)) });
                }
                // send and request items
                const itemsToSet = [];
                for (const { id, value } of itemsToSend) {
                    const modified = value._modified;
                    delete value._modified;
                    itemsToSet.push({
                        id,
                        modified,
                        value: JSON.stringify(value)
                    });
                }
                const request = {};
                if (itemsToSet.length) {
                    request.itemsToSet = itemsToSet;
                }
                if (itemIdsToGet.length) {
                    request.itemIdsToGet = itemIdsToGet;
                }
                resp = yield this.sendApiRequest(request);
                if (resp['error'])
                    return resp['error'];
                // import received items
                if (itemIdsToGet.length) {
                    for (const item of resp['items']) {
                        const obj = JSON.parse(item['value']);
                        obj._modified = parseInt(item['modified']);
                        localStorage.setItem(item['id'], JSON.stringify(obj));
                        this.updateIndex(item['id']);
                    }
                    this.updateSnapshot();
                }
                console.assert(resp['snapshot'] === this.getSnapshot());
            }
        });
    }
    sendApiRequest(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //return new Promise(function(resolve, reject) {
            data.key = (_a = localStorage.getItem('_key')) !== null && _a !== void 0 ? _a : '';
            return $.ajax({
                type: 'POST',
                url: 'https://shilov.org/cmd/api/storage.php',
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: 'json'
            });
        });
    }
    calculateSnapshot() {
        const parts = [];
        for (const id of this.allIds().sort())
            if (id[0] !== '_') {
                const value = localStorage.getItem(id);
                const item = JSON.parse(value);
                parts.push(`${id}${item._modified - idBase}`);
            }
        return window.SparkMD5.hash(parts.join(''));
    }
}
const storage = new Storage();
export default storage;
