import storage from "./storage.js";
import * as ui from "./ui.js";

let lastSyncTime = 0, syncInProgress = false, syncError = undefined;

export function updateSyncIndicator (text=undefined, show=syncInProgress) {
    if (!syncError) {
        if (text === undefined) {
            text = Math.min(99, Math.round((Date.now() - lastSyncTime) / 1000)).toString();
            if (text.length === 1) {
                text = '0' + text;
            }
        }
        ui.setSyncIndicator(show, text);
    }
}

export function startSync () {
    if (!syncInProgress) {
        syncInProgress = true;
        try {
            storage
                .sync()
                .then((error) => {
                    if (error) {
                        syncError = error;
                        ui.setSyncIndicator(false, syncError === 'Wrong key' ? 'key' : 'err');
                    } else {
                        syncError = undefined;
                        lastSyncTime = Date.now()
                    }
                })
                .finally(() => syncInProgress = false)
        } catch (e) {
            alert('Sync exception: ' + e.toString());
        }
        finally {
            syncInProgress = false;
        }
    }
}

export function setKey (text) {
    localStorage.setItem('_key', window.SparkMD5.ArrayBuffer.hash (new TextEncoder().encode(text), false))
}