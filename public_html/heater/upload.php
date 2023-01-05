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

$temp = $_POST['temp'];
$msg = $_POST['msg'];

// save data for the webpage
$fp = fopen('data.json', 'w');
fwrite($fp, json_encode(['temp' => $temp, 'msg' => $msg]));
fclose($fp);

//preg_match("/(?'moment'[^\[]+)\[(?'err'[^\]]*)\]\s+\{(?'temp'\S+)\s+\((?'contr'[^\)]+)\)\}/", $msg, $matches);

// save matches to file
//$fp = fopen('matches.txt', 'w');
//fwrite($fp, print_r($matches, true));
//fclose($fp);

if (strpos ($msg, '[6A]') !== false) {
    $temp = 127;
    $last_temp = get_last_temp();
    if ($last_temp !== $temp) {
        insert_record($temp);
        foreach (get_subscribed_chat_ids() as $chat) {
            send2telegram ("Там кажется 6A, см. https://shilov.org/heater", $chat);
            sleep(0.5);
        }
    }
}
else if ($temp > 0) {
    insert_record($temp);
}