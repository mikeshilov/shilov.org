<?php
require "db.php";

move_uploaded_file($_FILES["pic"]["tmp_name"], "pic.png");
$fp = fopen('data.json', 'w');
$temp = $_POST['temp'];
$msg = $_POST['msg'];
preg_match("/(?'min'\d+):(?'sec'\d+)\s+\[(?'err'[^\]]*)\]\s+\{(?'temp'\S+)\s+\((?'contr'[^\)]+)\)\}/", $msg, $matches);
fwrite($fp, json_encode(['temp' => $temp, 'msg' => $msg]));
fclose($fp);

if (isset($matches['err']) && $matches['err']==='6A') {
    $temp = -1;
}
insert_record($temp);