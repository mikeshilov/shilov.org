import storage from "../storage.js";
import {startSync} from "../sync.js";

export default class NotesApp {
    process(req, context) {
        if (context) {
            if (context.itemIdToDelete) {
                let deleted = false;
                if (req.toLowerCase() === "да") {
                    storage.deleteItem(context.itemIdToDelete);
                    startSync();
                    deleted = true;
                }
                return Promise.resolve({
                    'request': req,
                    'response': deleted ? 'удалил' : 'не стал удалять'
                });
            }
            else if (context.askedKeyToEditNote) {
                const text = storage.decText(context.askedKeyToEditNote.obj.e, req, context.askedKeyToEditNote.obj.h);
                if (text === undefined) {
                    return Promise.resolve({
                        'request': '***',
                        'response': 'не подходит :(',
                        'continueContext': {askedKeyToEditNote: context.askedKeyToEditNote}
                    });
                } else
                    return this.editNote(req, context.askedKeyToEditNote, text);
            }
            else if (context.updateItem) {
                const output = this.updateNote(req, context.updateItem.id);
                if (output) return output;
            }
            else {
                const cmdOnSearchResults = /^(?<cmd>(удали|измени|delete|edit))?\s*(?<num>\d+)$/i.exec(req);
                const reqNumber = cmdOnSearchResults === null ? 0 : parseInt(cmdOnSearchResults.groups['num']);
                const reqCommand = cmdOnSearchResults === null ? '' : (cmdOnSearchResults.groups['cmd'] ?? '').toLowerCase();

                if (context.selectedItem) {
                    const text = storage.decText(context.selectedItem.obj.e, req, context.selectedItem.obj.h);
                    if (text === undefined) {
                        return Promise.resolve({
                            'request': '***',
                            'response': 'не подходит :(',
                            'continueContext': {selectedItem:context.selectedItem}
                        });
                    } else
                        return this.showSelectedNote(req, context.selectedItem, text);
                } else if (context.foundItems && reqNumber>0 && context.foundItems.length>=reqNumber) {
                    const selectedItem = context.foundItems[reqNumber-1];
                    switch (reqCommand ?? '') {
                        case '':
                            if (selectedItem.obj.e)
                                return Promise.resolve({
                                    'request': req,
                                    'response': 'а ключик?',
                                    'continueContext': {selectedItem}
                                });
                            else
                                return this.showSelectedNote(req, selectedItem);
                        case 'edit':
                        case 'измени':
                            if (selectedItem.obj.e)
                                return Promise.resolve({
                                    'request': req,
                                    'response': 'а ключик?',
                                    'continueContext': {askedKeyToEditNote:selectedItem}
                                });
                            else
                                return this.editNote(req, selectedItem);
                        case 'delete':
                        case 'удали':
                            return Promise.resolve({
                                'request': req,
                                'response': `удалить "${ellipsis(selectedItem.obj.o, 30)}"?`,
                                'continueContext': {itemIdToDelete:selectedItem.id}
                            });
                    }
                }
            }
        }

        return this.updateNote (req) ?? this.searchNotes(req);
    }

    updateNote (req, noteId) {
        const rx = noteId !== undefined ? /^(?<o>.+?)(\.\.(?<e>.+)\.\.(?<k>.+))?$/is : /^(?<cmd>(запомни|remember|з)\s+)(?<o>.+?)(\.\.(?<e>.+)\.\.(?<k>.+))?$/is;
        const match = rx.exec(req);
        if (match !== null) {
            if (match.groups.o.indexOf('..') !== -1) {
                return Promise.resolve({
                    'request': req,
                    'response': "Двух точек не может быть в тексте заметки",
                    'prefill': req
                });
            }

            const o = match.groups.o,
                e = match.groups.e ? match.groups.e : undefined,
                k = match.groups.k ? match.groups.k.trim() : undefined;

            storage.updateNote(noteId, o, e, k);
            startSync();

            return Promise.resolve ({
                'request': req.replace(rx, '$<cmd>$<o>' + (e ? '..***' : '')),
                'response': noteId ? 'изменил' : 'запомнил'
            });
        }
    }

    editNote (req, noteItem, e='') {
        return Promise.resolve({
            'request': e ? '***' : req,
            'prefill': noteItem.obj.o + (e ? `..${e}..${req}` : ''),
            'continueContext': {updateItem:noteItem}
        });
    }

    showSelectedNote (req, noteItem, e='') {
        return Promise.resolve({
            'request': e ? '***' : req,
            'response': noteItem.obj.o + (e ? `[[hide:${e}]]` : '')
        });
    }

    searchNotes (text) {
        text = text.toLowerCase().trim();
        const foundItems = [];
        for (const item of storage.items(['note'])) {
            const note = item.obj.o;
            const found_index = note ? note.toLowerCase().indexOf(text) : -1;
            const max_len = 50;
            if (found_index >= 0) {
                item._snippet = note.length <= max_len ? note : '...' + note.substring(Math.max (0, found_index-max_len/2), Math.min (note.length, found_index+max_len/2)) + '...';
                foundItems.push(item);
            }
        }

        return foundItems.length
            ? Promise.resolve({
                'request': text,
                'response': foundItems.map((item, index) => `[pen.svg](#reply-измени ${index + 1})[trash.svg](#reply-удали ${index + 1})[${index + 1}. ${item._snippet}](#reply-${index + 1})`).join('\n'),
                'continueContext': foundItems.length ? {foundItems} : undefined
            })
            : undefined;
    }
}