import * as ui from "./ui.js";
import {startSync, updateSyncIndicator} from "./sync.js";
import MiscApp from "./apps/misc.js";
import NotesApp from "./apps/notes.js";

const apps = [new MiscApp(), new NotesApp()]
let contextApp, contextObject;

function processRequest (text) {
    requestHandler(text.trim()).then((output) => {
        ui.addRequestToChat(ui.markupToHtml(output.request));
        ui.setRequestInput(output.prefill ?? '');
        if (output.response) {
            ui.addResponseToChat(ui.markupToHtml(output.response));
        }
        if ((output.prefill ?? '').indexOf('\n') !== -1) {
            ui.setMultilineMode();
        } else {
            ui.focusOnInput();
        }
    });
}

function requestHandler (text) {
    if (text.length === 0) {
        contextApp = undefined;
        contextObject = undefined;
        ui.setContextIndicator (false);
        return Promise.resolve({'request': '', 'response':''});
    }
    else {
        for (let i = (contextApp ? -1 : 0); i < (contextApp ? 0 : apps.length); i++) {
            const app = i < 0 ? contextApp : apps[i];
            const outputPromise = app.process(text, contextObject);
            if (outputPromise) {
                return outputPromise.then(res => {
                    contextApp = res.continueContext ? app : undefined;
                    contextObject = res.continueContext;
                    ui.setContextIndicator (res.continueContext);
                    return res;
                });
            }
        }
        return Promise.resolve({'request': text, 'response': '8-()'});
    }
}

$(document).ready(function() {
    ui.setVerInfo('1.6');
    $("#sync-ind").click(()=>startSync());
    ui.init(processRequest);
    setInterval(()=>updateSyncIndicator(), 1000);
    startSync();
    setInterval(startSync, 60000);
    ui.focusOnInput();
});