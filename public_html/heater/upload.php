<?php
require "db.php";


function send2telegram ($text, $chat_id) {
    $ch = curl_init();
    curl_setopt_array(
        $ch,
        [
            CURLOPT_URL => 'https://api.telegram.org/bot5555709837:AAEJAFAgK_C3HHLNxsrOL6m22soM6i_wx5I/sendMessage',
            CURLOPT_POST => TRUE,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_POSTFIELDS => [
                'chat_id' => $chat_id,
                'text' => $text,
            ],
        ]
    );
    curl_exec($ch);
}


move_uploaded_file($_FILES["pic"]["tmp_name"], "pic.png");
$fp = fopen('data.json', 'w');
$temp = $_POST['temp'];
$msg = $_POST['msg'];
preg_match("/(?'moment'[^\[]+)\[(?'err'[^\]]*)\]\s+\{(?'temp'\S+)\s+\((?'contr'[^\)]+)\)\}/", $msg, $matches);
fwrite($fp, json_encode(['temp' => $temp, 'msg' => $msg]));
fclose($fp);

$emulate6A = FALSE;

if ($emulate6A || (isset($matches['err']) && $matches['err']==='6A')) {
    $temp = 127;
    $last_temp = get_last_temp();
    if ($last_temp !== $temp) {
        insert_record($temp);
        foreach (get_subscribed_chat_ids() as $chat) {
            send2telegram ("Там кажется 6A, см. https://shilov.org/heater", $chat);
        }
    }
}
else if ($temp > 0) {
    insert_record($temp);
}