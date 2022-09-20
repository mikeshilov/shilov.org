import {startSync, setKey} from "../sync.js";

export default class MiscApp {
    process(req, context) {
        if (context) {
            if (context.resetTheStorage) {
                let reset = false;
                if (req.toLowerCase() === "да") {
                    localStorage.clear();
                    startSync();
                    reset = true;
                }
                return Promise.resolve({
                    'request': req,
                    'response': reset ? "хранилище очищено" : "сброс хранилища отменён"
                });
            }
        }

        const match = /^(?<cmd>(сброс|помощь|ключ|\?))(\s+(?<text>\S+))?$/i.exec(req);
        if (match) {
            switch (match.groups['cmd'].toLowerCase()) {
                case "сброс":
                    return Promise.resolve({
                        'request': req,
                        'response': "очистить локальное хранилище?",
                        'continueContext': {resetTheStorage: 1}
                    });
                case "?":
                case "помощь":
                    return Promise.resolve({
                        'request': req,
                        'response': `**сброс** - очистить локальное хранилище
                    **запомни** текст[..секрет..ключ] - создать новую заметку
                    `
                    });
                case "ключ":
                    setKey(match.groups['text']);
                    startSync();
                    return Promise.resolve({
                        'request': 'ключ ***',
                        'response': "ключ установлен",
                    });
            }
        }
    }
}