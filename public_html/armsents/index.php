<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="shortcut icon" href="favicon.png">
    <title>Armenian sentences</title>
    <style>
        .container {
            max-width: 500px;
        }
        .sent-text {
            margin: 20px 0;
        }
    </style>
</head>
<body style="padding: 10px">
<div id="container" class="container">
    <audio id="audio-control" controls>
        <source id="audio-source" src="" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
    <div id="sent-text" class="sent-text alert alert-primary" style="display: none"></div>
    <div id="sent-trans" class="sent-text alert alert-success" style="display: none"></div>
    <div style="margin: 20px 0">
        <button id="btn-show-text" type="button" class="btn btn-primary" onclick="showTextClicked()">Text</button>
        <button type="button" class="btn btn-success" onclick="showTransClicked()">Trans</button>
        <button type="button" class="btn btn-danger" onclick="nextClicked()">Next</button>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
<script src="config.js?v=<?=time()?>"></script>
<script src="sentences.js?v=<?=time()?>"></script>
<script src="main.js?v=<?=time()?>"></script>
</body>
</html>