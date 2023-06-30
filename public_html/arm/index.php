<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="shortcut icon" href="favicon.png">
    <title>Armenian tests</title>
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
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
<script src="utils.js?v=<?=time()?>"></script>
<script src="config.js?v=<?=time()?>"></script>
<script src="VerbTester.js?v=<?=time()?>"></script>
<script src="main.js?v=<?=time()?>"></script>
</body>
</html>