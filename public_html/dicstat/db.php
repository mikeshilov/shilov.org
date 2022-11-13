<?php

$db = new mysqli('localhost', "mikeshilov_dic", "C6NV7a&D", "mikeshilov_dic");
if ($db->connect_errno) throw new Exception('Could not connect to database: ' . $db->connect_error);
$db->set_charset('utf8');
db_query("SET sql_mode = ''");
db_query("SET @@session.time_zone = '+00:00'");
date_default_timezone_set('UTC');

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

function get_name2ids () {
    $res = db_query("
SELECT DISTINCT e_who 
FROM events 
WHERE e_who NOT IN (
                    '00000000-0000-0000-0000-000000000000',
                    '26e653c5-b02b-4a7c-9763-dfa4fd0192a2',
                    '6d4dfde8-2df6-43e7-a4ea-1be0995d2912',
                    'f8d72c80-9e58-4b87-aee4-9b7c702a78f3'
                   )
ORDER BY e_when DESC");
    $items = $res->fetch_all(MYSQLI_ASSOC);
    $name2id = [];
    foreach ($items as $item) {
        $name = strtoupper(substr ($item['e_who'], 9, 4));
        if (array_key_exists($name, $name2id)) {
            throw new Exception("The current name shortening algothyms is insufficient and needs to be modified. '$name' is duplicated.");
        } else {
            $name2id[$name] = $item['e_who'];
        }
    }
    return $name2id;
}

function get_info ($id) {
    $res = db_query("
SELECT 
    MIN(e_when) as min, 
    MAX(e_when) as max,
    (SELECT e_params FROM events WHERE e_what='app.preset.load' and e_who='$id' LIMIT 1) as preset_load,
    (SELECT COUNT(1) FROM events WHERE e_what='analytics.visualizer.change' and e_who='$id') as vis_changes,
    (SELECT COUNT(1) FROM events WHERE e_what='analytics.visualizer.setting' and e_who='$id') as vis_settings,
    (SELECT COUNT(1) FROM events WHERE e_what='table.column.select' and e_who='$id') as col_selects,
    (SELECT COUNT(1) FROM events WHERE e_what LIKE 'menu.sidebar.%' and e_who='$id') as sidebar_menu,
    (SELECT COUNT(1) FROM events WHERE e_what LIKE 'app.error.%' and e_who='$id') as app_errors
FROM events 
WHERE e_who='$id'
");
    $row = $res->fetch_all(MYSQLI_ASSOC);
    return count($row) ? [
        'started' => strtotime($row[0]['min']),
        'ended' => strtotime($row[0]['max']),
        'preset' => json_decode($row[0]['preset_load'])->name,
        'vis_changes' => $row[0]['vis_changes'],
        'vis_settings' => $row[0]['vis_settings'],
        'col_selects' => $row[0]['col_selects'],
        'sidebar_menu' => $row[0]['sidebar_menu'],
        'app_errors' => $row[0]['app_errors']
    ]  : NULL;
}

function get_events ($id) {
    $res = db_query("SELECT e_when, e_what, e_params FROM events WHERE e_who='$id' ORDER BY e_when");
    return $res->fetch_all(MYSQLI_ASSOC);
}

function get_menus ($id) {
    $res = db_query("SELECT e_what FROM events WHERE e_what LIKE 'menu.sidebar.%' and e_who='$id'");
    $menus = [];
    foreach ($res->fetch_all(MYSQLI_ASSOC) as $row) {
        $menus[]=str_replace ('menu.sidebar.', '', $row['e_what']);
    }
    return $menus;
}