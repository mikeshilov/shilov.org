<?php

require "db.php";

function exception_handler($exception) {
    //header("http/1.0 500 Internal server error");
    //header("Content-Type: text/plain; charset=utf-8");
    send2telegram ($exception->getMessage());
    exit;
}

function error_handler ($errno, $errstr, $errfile, $errline) {
    //header("http/1.0 500 Internal server error");
    //header("Content-Type: text/plain; charset=utf-8");
    send2telegram ("$errno: $errstr at $errline line of $errfile");
    exit;
}

set_exception_handler('exception_handler');
set_error_handler('error_handler');

function send2telegram ($answer) {
    global $chat_id;
    header("Content-Type: application/json");
    echo json_encode([
        'method' => 'sendMessage',
        'chat_id' => $chat_id,
        //'reply_to_message_id' => $message_id,
        'text' => $answer
    ]);
}

// получаем запрос от Телеграма
$data = file_get_contents("php://input");

// keep the last message in file for logging
$fp = fopen('telega.json', 'w');
fwrite($fp, $data);
fclose($fp);

// parse received json
$pack = json_decode($data, 1);
if (!$pack) die();

// вытаскиваем текст сообщения
$message_id = $pack['message']['message_id'];
$user_id = $pack['message']['from']['id'];
$user_name = $pack['message']['from']['first_name'];
$chat_id = $pack['message']['chat']['id'];
$text = $pack['message']['text'];
if (!$message_id || !$chat_id || !$text) die();

// process the request
$answer='';
switch ($text) {
    case '/1':
        subscribe_user($user_id, $user_name, $chat_id);
        send2telegram('Теперь вы подписаны на сообщения от котла. Текущую температуру можно смотреть на https://shilov.org/heater');
        break;
    case '/0':
        unsubscribe_user($user_id);
        send2telegram('Теперь вы отписаны от сообщений котла');
        break;
    default:
        send2telegram("Не понял, что значит \"$text\"");
        break;
}