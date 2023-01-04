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
    $v = is_numeric($val) ? $val : 'NULL';
    db_query("INSERT INTO records (moment, value) VALUES (NOW(), $v)");
}