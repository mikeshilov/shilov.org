<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="shortcut icon" href="favicon.png">
    <title>Armenian tests</title>
    <style>
        .word-distr-table {
            width: 100%;
            margin-bottom: 3px;
        }
        .word-distr-table td {
            border-radius: 5px;
            padding: 1px 5px 1px 5px;
            color: white;
            font-weight: 400;
            text-align: center;
            max-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .bg1 {background-color: #f44336}
        .bg2 {background-color: #2196f3}
        .bg3 {background-color: #8bc34a}
        .bg4 {background-color: #ff5722}
        .bg5 {background-color: #e91e63}
        .bg6 {background-color: #03a9f4}
        .bg7 {background-color: #cddc39}
        .bg8 {background-color: #795548}
        .bg9 {background-color: #9c27b0}
        .bg10 {background-color: #00bcd4}
        .bg11 {background-color: #ffeb3b}
        .bg12 {background-color: #673ab7}
        .bg13 {background-color: #009688}
        .bg14 {background-color: #ffc107}
        .bg15 {background-color: #3f51b5}
        .bg16 {background-color: #4caf50}
        .bg17 {background-color: #ff9800}
        .bg18 {background-color: #c62828}
        .bg19 {background-color: #1565c0}
        .bg20 {background-color: #558b2f}
        .bg21 {background-color: #d84315}
        .bg22 {background-color: #ad1457}
        .bg23 {background-color: #0277bd}
        .bg24 {background-color: #9e9d24}
        .bg25 {background-color: #4e342e}
        .bg26 {background-color: #6a1b9a}
        .bg27 {background-color: #00838f}
        .bg28 {background-color: #f9a825}
        .bg29 {background-color: #4527a0}
        .bg30 {background-color: #00695c}
        .bg31 {background-color: #ff8f00}
        .bg32 {background-color: #283593}
        .bg33 {background-color: #2e7d32}
        .bg34 {background-color: #ef6c00}
    </style>
</head>
<body style="padding: 10px">
<div id="container" class="container">
    <div id="well-done" class="alert alert-success" role="alert" style="display: none">
        <h1 class="alert-heading">Well done!</h1>
    </div>
    <div id="game">
        <h1 id="text-question" style="display: none"></h1>
        <div id="audio-question" style="display: none">
            <audio id="audio-control" controls>
                <source id="audio-source" src="" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        </div>
        <label for="answer" class="form-label">in <span style="color: red">A</span><span style="color: blue">r</span><span style="color: orangered">m</span>enian will be</label>
        <input id="answer" type="text" class="form-control">
        <div id="feedback" class="invalid-feedback" style="display: none"></div>
        <div id="pronunciation" style="display: none; margin-top: 1rem">
            <audio id="pronunciation-control" controls>
                <source id="pronunciation-source" src="" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        </div>
        <div class="progress my-3">
            <div id="progress" class="progress-bar progress-bar-striped" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div style="margin-bottom: 5px;">
            <a id="distr-switch" href="#" onclick="document.getElementById('distr-switch').innerText = toggleVisibility('word-distr') ? 'hide word distribution' : 'show word distribution';">show word distribution</a>
        </div>
        <div id="word-distr" style="display: none">
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
<script src="utils.js?v=<?=time()?>"></script>
<script src="config.js?v=<?=time()?>"></script>
<script src="VerbTester.js?v=<?=time()?>"></script>
<script src="main.js?v=<?=time()?>"></script>
</body>
</html>