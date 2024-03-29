<?php
require "db.php";

header("Content-Type: application/json; charset=utf-8");

function exception_handler($exception) {
    //header("http/1.0 500 Internal server error");
    //header("Content-Type: text/plain; charset=utf-8");
    echo $exception->getMessage();
    exit;
}

function error_handler ($errno, $errstr, $errfile, $errline) {
    //header("http/1.0 500 Internal server error");
    //header("Content-Type: text/plain; charset=utf-8");
    echo "$errno: $errstr at $errline line of $errfile";
    exit;
}

set_exception_handler('exception_handler');
set_error_handler('error_handler');

if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'get':
            $data = json_decode(file_get_contents('data.json'), true);
            $pic = file_get_contents('pic.png');
            echo json_encode(['temp'=>$data['temp'], 'msg'=>$data['msg'], 'pic'=>base64_encode($pic)]);
            break;
        case 'last':
            if (isset($_GET['hours']) && is_numeric($_GET['hours'])) {
                echo json_encode(['rows'=>get_last_values($_GET['hours'])]);
            }
            else
                echo json_encode(['error'=>'hours parameter is missing']);
            break;
        default:
            echo "action is not supported";
    }
} else
    echo "'action' parameter is missed";
