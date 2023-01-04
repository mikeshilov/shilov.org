<?php
move_uploaded_file($_FILES["pic"]["tmp_name"], "pic.png");
$fp = fopen('data.json', 'w');
fwrite($fp, json_encode(['temp' => $_POST['temp'], 'msg' => $_POST['msg']]));
fclose($fp);
