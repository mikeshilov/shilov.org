<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#ffffff">

    <title>CMD</title>

    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="fonts/fonts.css">

    <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">
    <link rel="manifest" href="manifest.json">
    <link rel="mask-icon" href="icons/safari-pinned-tab.svg" color="#5bbad5">
    <link rel="shortcut icon" href="icons/favicon.ico">

    <script src="jquery.js"></script>
    <script src="utils.js"></script>
    <script src="spark-md5.min.js"></script>
    <script src="modules/main.js" type="module"></script>
</head>
<body>
    <div id="container">
        <div id="chat-panel">
        </div>
        <hr/>
        <table id="input-panel">
            <tr>
                <td id="expand-icon" style="width:15px;">
                    <svg style="height: 17px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M136 32h-112C10.75 32 0 42.75 0 56v112C0 181.3 10.75 192 24 192C37.26 192 48 181.3 48 168V80h88C149.3 80 160 69.25 160 56S149.3 32 136 32zM424 32h-112C298.7 32 288 42.75 288 56c0 13.26 10.75 24 24 24h88v88C400 181.3 410.7 192 424 192S448 181.3 448 168v-112C448 42.75 437.3 32 424 32zM136 432H48v-88C48 330.7 37.25 320 24 320S0 330.7 0 344v112C0 469.3 10.75 480 24 480h112C149.3 480 160 469.3 160 456C160 442.7 149.3 432 136 432zM424 320c-13.26 0-24 10.75-24 24v88h-88c-13.26 0-24 10.75-24 24S298.7 480 312 480h112c13.25 0 24-10.75 24-24v-112C448 330.7 437.3 320 424 320z"/></svg>
                </td>
                <td id="input-angle" style="width:10px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M113.3 47.41l183.1 191.1c4.469 4.625 6.688 10.62 6.688 16.59s-2.219 11.97-6.688 16.59l-183.1 191.1c-9.152 9.594-24.34 9.906-33.9 .7187c-9.625-9.125-9.938-24.38-.7187-33.91l168-175.4L78.71 80.6c-9.219-9.5-8.906-24.78 .7187-33.91C88.99 37.5 104.2 37.82 113.3 47.41z"/></svg>
                </td>
                <td>
                    <input type="text" id="request-input" autofocus />
                </td>
            </tr>
        </table>
    </div>
    <div id="multiline-container" style="display:none">
            <textarea id="multiline-text"></textarea>
    </div>
    <div id="ver-info">x</div>
    <div id="sync-ind">
        <svg height=40 width=40 style="opacity: 0">
            <circle stroke=#ff5722
                    fill=transparent
                    stroke-linecap=round
                    stroke-width=3
                    stroke-dasharray="88 88"
                    stroke-dashoffset="88"
                    r=14
                    cx=20
                    cy=20
                    transform=rotate(-90,20,20)
            >
                <animate attributeName="stroke-dashoffset" from=88 to=0 dur="0.7s" repeatCount="indefinite" />
                <animate attributeName="stroke-dasharray" values="88 0;0 88;88 0" dur="1.7s" keyTimes="0; 0.5; 1" repeatCount="indefinite" />
            </circle>
        </svg>
        <div id="sync-txt">
            <div></div>
        </div>
    </div>
    <script>
        /*
        $(function () {
            if('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js')
                    .then(() => console.log('service worker registered'))
                    .catch(err => console.log('service worker not registered: ', err));
            }
        });
        */
        </script>
</body>
</html>