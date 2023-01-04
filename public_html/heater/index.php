<!doctype html>

<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--<meta http-equiv="refresh" content="1" >-->
    <title>HEATER</title>
</head>

<body style="background-color: #150a49; color: white; padding: 10px; font-family:monospace">
<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <img id="pic" src="" alt='pic'/>
    <h1 id="temp"></h1>
    <h3 id="msg"></h3>
</div>
<script>
    let interval_id, requesting=false, xmlHttp;

    function request()
    {
        if (!requesting && !document.hidden) {
            requesting = true;
            xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    try {
                        const resp = JSON.parse(xmlHttp.responseText);
                        document.getElementById("msg").innerText = resp['msg'];
                        document.getElementById("temp").innerText = resp['temp'];
                        document.getElementById("pic").src = 'data:image/png;base64,' + resp['pic'];
                        requesting = false;
                    } catch {
                        console.log("API response error: " + xmlHttp.responseText)
                    }

                }
            }
            xmlHttp.open("GET", 'api.php?action=get', true);
            xmlHttp.send(null);
        }
    }

    window.onload = function() {
        request();
        interval_id = setInterval(request, 500);
    }

    window.onbeforeunload = function (){
        clearInterval(interval_id);
        if (xmlHttp) {
            xmlHttp.abort();
        }
    };
</script>
</body>
</html>
