import * as SparkMD5 from "./spark-md5.min";
const escapeHtml = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
};
const encoder = new TextEncoder();
const decoder = new TextDecoder();
// https://github.com/satazor/js-spark-md5
const enc = (text, key) => {
    var _a;
    const h = SparkMD5.ArrayBuffer.hash(encoder.encode(key), true);
    const o = encoder.encode(text);
    const e = new Uint8Array(o.length);
    for (let i = 0; i < o.length; i++)
        e[i] = ((_a = o[i]) !== null && _a !== void 0 ? _a : 0) ^ h.charCodeAt(i % h.length);
    return btoa(String.fromCharCode(...new Uint8Array(e)));
};
const dec = (e, key) => {
    const h = SparkMD5.ArrayBuffer.hash(encoder.encode(key), true);
    const binaryString = atob(e);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i) ^ h.charCodeAt(i % h.length);
    }
    return decoder.decode(bytes);
};
const ellipsis = (text, max_len = 15) => text.length > max_len ? text.substring(0, max_len) + '...' : text;
