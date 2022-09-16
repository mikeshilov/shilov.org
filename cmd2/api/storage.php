<?php

header("Content-Type: application/json; charset=utf-8");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
const ID_BASE = 1654885500000;

function error ($message) {
    //header("http/1.0 500 Internal server error");
    echo json_encode(['error'=>$message]);
    die;
}

function error_handler ($severity, $message, $filename, $lineno) {
    error ($message);
}

set_error_handler('error_handler');

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

/**
 * @throws Exception
 */
function db_updateSnapshot() {
    $res = db_query("SELECT id, modified FROM storage WHERE id NOT LIKE '\_%' AND deleted=0 ORDER BY id");
    $rows = $res->fetch_all(MYSQLI_ASSOC);
    $parts = [];
    foreach ($rows as $row) {
        $parts[] = $row['id'].($row['modified']-ID_BASE);
    }
    $snapshot = md5(implode($parts));
    db_query("INSERT INTO storage (id, val, modified) VALUES ('_snapshot', '$snapshot', 0) ON DUPLICATE KEY UPDATE val = '$snapshot'");
}

/**
 * @throws Exception
 */
function db_getSnapshot () {
    $trial=0;
    $row = null;
    while ($trial<2) {
        $trial+=1;
        $res = db_query("SELECT val FROM storage WHERE id='_snapshot'");
        $row = $res->fetch_assoc();
        if ($row == null) {
            db_updateSnapshot();
            continue;
        }
    }
    return $row ? $row['val'] : '';
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    if (!$data || $data->key !== "496c880caac1c145af6c335318725b4f") {
        throw new Exception ('Wrong key');
    }

    $db = new mysqli('localhost', "mikeshilov_cmd", "t7&LOhAE", "mikeshilov_cmd");
    if ($db->connect_errno) throw new Exception('Could not connect to database: ' . $db->connect_error);
    $db->set_charset('utf8');
    db_query("SET sql_mode = ''");
    db_query("SET @@session.time_zone = '+00:00'");
    date_default_timezone_set('UTC');

    $response = [];
    $changed = false;
    $db->begin_transaction();
    try {

        if (isset($data->command)) {
            switch ($data->command) {
                case "getAllItemSummary":
                    $res = db_query("SELECT id, modified, deleted FROM storage WHERE id NOT LIKE '\_%'");
                    $response['itemSummary'] = $res->fetch_all(MYSQLI_ASSOC);
                    break;
                default:
                    throw new Exception ("Unknown command");
            }
        }

        if (isset($data->deletedItemIds)) {
            $statement = $db->prepare("UPDATE storage SET deleted=1 WHERE id=?");
            if (!$statement)
                throw new Exception ('Statement preparation failed: '.$db->error);

            foreach ($data->deletedItemIds as $id) {
                if (!$statement->bind_param("s",$id))
                    throw new Exception ('Parameter binding failed'.$db->error);

                if (!$statement->execute())
                    throw new Exception ('Statement execution failed'.$db->error);

            }
            $changed = true;
        }

        if (isset($data->itemsToSet)) {
            $statement = $db->prepare("INSERT INTO storage (id, val, modified, deleted) VALUES (?,?,?,0) ON DUPLICATE KEY UPDATE val=?, modified=?");
            if (!$statement)
                throw new Exception ('Statement preparation failed: '.$db->error);

            foreach ($data->itemsToSet as $item) {
                if (!$statement->bind_param("ssisi",$item->id, $item->value, $item->modified, $item->value, $item->modified))
                    throw new Exception ('Parameter binding failed'.$db->error);

                if (!$statement->execute())
                    throw new Exception ('Statement execution failed'.$db->error);

            }
            $changed = true;
        }

        if (isset($data->itemIdsToGet)) {
            $ids = array();
            foreach ($data->itemIdsToGet as $id) $ids[]="'$id'";
            $res = db_query("SELECT id, val as value, modified FROM storage WHERE id IN (".implode(',', $ids).")");
            $response['items'] = $res->fetch_all(MYSQLI_ASSOC);
        }

        $db->commit();

        if ($changed) {
            db_updateSnapshot();
        }

        $response['snapshot'] = db_getSnapshot();
        echo json_encode($response);
    }
    catch (Exception $e) {
        $db->rollback();
        throw $e;
    }
}
catch (Exception $e) {
    error ($e->getMessage());
}