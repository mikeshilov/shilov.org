<?php

$db = new mysqli('localhost', "mikeshilov_heat", "*&hCq%2A", "mikeshilov_heat");
if ($db->connect_errno) throw new Exception('Could not connect to database: ' . $db->connect_error);
$db->set_charset('utf8');
db_query("SET sql_mode = ''");
db_query("SET @@session.time_zone = '+02:00'");
date_default_timezone_set('Europe/Kaliningrad');

/**
 * @throws Exception
 */
function db_query ($query)
{
    global $db;
    $res=$db->query ($query);
    if (!$res) throw new Exception ($db->error.' at '.$query);
    return $res;
}

function insert_record ($val) {
    $v = is_numeric($val) ? $val*2 : 'NULL';
    db_query("INSERT INTO records (moment, value) VALUES (NOW(), $v)");
}

function get_last_temp () {
    $res = db_query("SELECT value FROM records WHERE value IS NOT NULL ORDER BY moment DESC LIMIT 1");
    return $res->fetch_assoc()['value']/2;
}

function get_subscribed_chat_ids () {
    $res = db_query("SELECT chat FROM users WHERE subscribed=1");
    $list = [];
    foreach ($res->fetch_all(MYSQLI_ASSOC) as $row)
        $list[]=$row['chat'];
    return $list;
}

function subscribe_user ($id, $name, $chat) {
    if (is_numeric($id) && is_numeric($chat)) {
        $name = str_replace("'", "\\'", $name);
        db_query("INSERT INTO users (id, name, chat, subscribed) VALUES ($id, '$name', $chat, 1) ON DUPLICATE KEY UPDATE name='$name', chat=$chat, subscribed=1");
    }
}

function unsubscribe_user ($id) {
    if (is_numeric($id)) {
        db_query("UPDATE users SET subscribed=0 WHERE id=$id");
    }
}