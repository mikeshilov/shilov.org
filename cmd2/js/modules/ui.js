const chat = $("#chat-panel");
const input = $("#request-input");
const multilineContainer = $("#multiline-container");
const multiline = $("#multiline-text");
let requestProcessor = () => alert("requestProcessor is called before initialization");
const inputValToText = () => input.val().replace(/\\n\s?/g, '\n');
const textToInputVal = (text) => text.replace(/\n/g, '\\n ');
export function init(requestProc) {
    requestProcessor = requestProc;
    input.on('keyup', e => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            requestProcessor(inputValToText());
            e.preventDefault();
        }
    });
    $("#expand-icon").click(() => {
        setMultilineMode(!multilineContainer.is(":visible"));
    });
}
export function setMultilineMode(on = true) {
    if (on && !multilineContainer.is(":visible")) {
        multiline.val(inputValToText());
        multilineContainer.show();
        multiline.focus();
    }
    else if (!on && multilineContainer.is(":visible")) {
        multilineContainer.hide();
        input.val(textToInputVal(multiline.val()));
        focusOnInput();
    }
}
export function markupToHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") // **strong**
        .replace(/(\r\n|\r|\n)/g, '<br>') // \r \n
        .replace(/\[(?<name>[^.]+)\.svg]\(#reply-(?<reply>[^)]+)\)/g, '<img data-reply="$<reply>" src="img/$<name>.svg" class="reply-link" />') // [img.svg](#reply-text)
        .replace(/\[(?<title>[^\]]+)]\(#reply-(?<reply>[^)]+)\)/g, '<span data-reply="$<reply>" class="reply-link">$<title></span>') // [title](#reply-text)
        .replace(/\[\[hide:(?<text>[^\]]+)]]/g, '<span class="reply-secret">$<text></span>') //    [[hide:text]]
        .replace(/(?<url>https?:\/\/(www\.)?[-a-z\d@:%._+~#=]{1,256}\.[a-z\d()]{1,6}\b([-a-z\d()@:%_+.~#?&/=]*))/ig, '<a href="$<url>" target="_blank">$<url></a>'); // https://...
}
export function addRequestToChat(text) {
    chat.append(`<div class="request">${text}</div>`);
    chat.animate({ scrollTop: chat.prop("scrollHeight") }, 500);
}
export function addResponseToChat(text) {
    chat.append(`<div class="response">${text}</div>`);
    chat.animate({ scrollTop: chat.prop("scrollHeight") }, 500);
    $(".reply-link").off();
    $(".response:last-child .reply-link")
        .on("click", event => {
        event.preventDefault();
        requestProcessor($(event.target).data('reply').toString());
    });
    $(".reply-secret")
        .on("click", event => {
        event.preventDefault();
        $(event.target).text('***');
        $(event.target).removeClass('reply-secret');
    });
}
export function setRequestInput(text) {
    input.val(textToInputVal(text));
}
export function focusOnInput() {
    input.focus();
}
export function setContextIndicator(on) {
    $("#input-angle").css("color", on ? "red" : "black");
}
export function setVerInfo(text) {
    $("#ver-info").text(text);
}
export function setSyncIndicator(show, text = '') {
    $("#sync-ind svg").css("opacity", show ? 1 : 0);
    $("#sync-txt > div").text(text);
}
