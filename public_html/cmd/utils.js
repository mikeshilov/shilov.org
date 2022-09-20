const escapeHtml = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// https://github.com/satazor/js-spark-md5

const enc = (text, key) => {
    const h = window.SparkMD5.ArrayBuffer.hash (encoder.encode(key), true);
    const o = encoder.encode(text);
    const e = new Uint8Array(o.length);
    for (let i=0;i<o.length;i++)
        e[i] = o[i] ^ h.charCodeAt(i % h.length);
    return btoa(String.fromCharCode(...new Uint8Array(e)));
}

const dec = (e, key) => {
    const h = window.SparkMD5.ArrayBuffer.hash (encoder.encode(key), true);
    const binstr = atob(e);
    const bytes = new Uint8Array(binstr.length);
    for (let i = 0; i < binstr.length; i++) {
        bytes[i] = binstr.charCodeAt(i) ^ h.charCodeAt(i % h.length);
    }
    return decoder.decode(bytes);
}

const ellipsis = (text, max_len=15) => text.length > max_len ? text.substring(0, max_len)+'...' : text;