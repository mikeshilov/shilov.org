const idBase = 1654885500000;
const indexKey = "_index";
const deletedKey = "_deleted";

class Storage {
    setItem (name, obj) {
        obj._modified = Date.now();
        localStorage.setItem(name, JSON.stringify(obj));
        this.updateIndex(name);
        this.updateSnapshot();
    }

    updateNote (noteId, o, e, k) {
        this.setItem(noteId ?? `note:${Date.now() - idBase}`, e
            ? {'o':o, 'e':enc(e, k), 'h':window.SparkMD5.ArrayBuffer.hash (encoder.encode(e), false)}
            : {'o':o}
        );
    }

    decText (e, k, h) {
        const text = dec (e, k);
        const h2 = window.SparkMD5.ArrayBuffer.hash (encoder.encode(text), false);
        return h2 === h ? text : undefined;
    }

    updateList (name, id, remove=false) {
        let list = localStorage.getItem(name) ?? '';
        const item = ` ${id} `;
        if (list.indexOf(item) === -1) {
            if (!remove) {
                list += item;
            }
        } else if (remove) {
            list = list.replace(item, '')
        }
        list = list.replaceAll('    ', '  ');
        localStorage.setItem(name, list);
    }

    updateIndex (id, remove=false) {
        this.updateList (indexKey, id, remove);
    }

    updateDeleted (id, remove=false) {
        this.updateList (deletedKey, id, remove);
    }

    isIdDeleted (id) {
        return (localStorage.getItem(deletedKey) ?? '').indexOf(` ${id} `) >= 0;
    }

    deleteItem (id) {
        this.updateIndex(id, true);
        this.updateDeleted(id);
        localStorage.removeItem(id);
        this.updateSnapshot();
    }

    *items (categories=null) {
        for (const key of this.allIds()) {
            for (const cat of categories ?? [null]) {
                if (cat===null || key.trim().indexOf(`${cat}:`)===0) {
                    yield {id:key, obj:JSON.parse(localStorage.getItem(key))};
                }
            }
        }
    }

    allIds (deleted=false) {
        return (localStorage.getItem(deleted ? deletedKey : indexKey) ?? '').split(' ').map (id=>id.trim()).filter(id => id.length);
    }

    getSnapshot () {
        let snapshot = localStorage.getItem('_snapshot');
        if (snapshot === null) {
            this.updateSnapshot();
            snapshot = localStorage.getItem('_snapshot');
        }
        return snapshot;
    }

    updateSnapshot () {
        return localStorage.setItem('_snapshot', this.calculateSnapshot());
    }

    async sync() {
        let resp = await this.sendApiRequest({});
        if (resp['error']) return resp['error'];

        const serverSnapshot = resp['snapshot'] ?? "";
        if (serverSnapshot !== this.getSnapshot()) {
            const itemIdsToGet = [];
            const itemsToSend = [];
            const serverIds = [];

            resp = await this.sendApiRequest({"command":"getAllItemSummary", "deletedItemIds":this.allIds(true)});
            if (resp['error']) return resp['error'];

            // iterate through server items
            for (let serverItem of resp['itemSummary']) {
                const id = serverItem['id'];
                const isDeletedLocally = this.isIdDeleted(id);
                if (parseInt(serverItem['deleted'])) {
                    if (!isDeletedLocally) {
                        this.deleteItem(id);
                    }
                } else {
                    const localValue = localStorage.getItem(id);
                    serverIds.push(id);
                    if (!isDeletedLocally) {
                        if (localValue === null) {
                            itemIdsToGet.push(id)
                        } else {
                            const localItem = JSON.parse(localValue);
                            const serverItemModified = parseInt(serverItem['modified']);
                            if (localItem._modified < serverItemModified) {
                                itemIdsToGet.push(id)
                            } else if (localItem._modified > serverItemModified) {
                                itemsToSend.push({id, value: localItem});
                            }
                        }
                    }
                }
            }

            // iterate through new local items
            for (const id of this.allIds().filter(id => serverIds.indexOf(id)<0)) {
                itemsToSend.push({id, value:JSON.parse(localStorage.getItem(id))});
            }

            // send and request items
            const itemsToSet = [];
            for (const {id, value} of itemsToSend) {
                const modified = value._modified;
                delete value._modified;
                itemsToSet.push ({
                    id,
                    modified,
                    value: JSON.stringify(value)
                })
            }

            const request = {}
            if (itemsToSet.length) {
                request.itemsToSet = itemsToSet;
            }
            if (itemIdsToGet.length) {
                request.itemIdsToGet = itemIdsToGet;
            }

            resp = await this.sendApiRequest(request);
            if (resp['error']) return resp['error'];

            // import received items
            if (itemIdsToGet.length) {
                for (const item of resp['items']) {
                    const obj = JSON.parse(item['value']);
                    obj._modified = parseInt(item['modified']);
                    localStorage.setItem(item['id'], JSON.stringify(obj));
                    this.updateIndex(item['id']);
                }
                this.updateSnapshot ();
            }

            console.assert(resp['snapshot'] === this.getSnapshot());
        }
    }

    async sendApiRequest (data) {
        //return new Promise(function(resolve, reject) {
        data.key = localStorage.getItem('_key') ?? '';
        return $.ajax({
            type: 'POST',
            url: '/cmd/api/storage.php',
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json'
        });
    }

    calculateSnapshot () {
        const parts = [];
        for (const id of this.allIds().sort())
            if (id[0] !== '_') {
                const value = localStorage.getItem(id);
                const item = JSON.parse(value);
                parts.push (`${id}${item._modified - idBase}`);
            }
        return window.SparkMD5.hash(parts.join(''))
    }
}

const storage = new Storage();

export default storage;