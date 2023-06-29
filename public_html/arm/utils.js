function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function saveConfig () {
    fetch('savecfg.php', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    })
        .then(response => response.json())
        .then(response => {
            if (!response.success) {
                alert("Saving configuration error ((");
            }
        })
}

function loadConfigAndStart (callback) {
    const xhr = new XMLHttpRequest();
    xhr.ontimeout = () => alert (`The request for cfg.json timed out.`);
    xhr.onload = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                config = JSON.parse(xhr.responseText);
                callback();
            } else {
                alert ('Loading config error: ' + xhr.statusText);
            }
        }
    };
    xhr.open("GET", "cfg.json", true);
    xhr.timeout = 2000;
    xhr.send(null);
}
