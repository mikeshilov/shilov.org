<?php
$json = json_decode(file_get_contents('data.json'), true);
?>
<!doctype html>

<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="1" >
    <title>HEATER</title>
</head>

<body style="padding: 10px">
<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <img src="pic.png?ver=<?=time()?>" alt='pic'/>
    <h1><?=$json['temp'];?></h1>
    <h3><?=$json['msg'];?></h3>
</div>
<script></script>
</body>
</html>
