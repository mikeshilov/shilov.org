<?php

header("Content-Type: application/json; charset=utf-8");
file_put_contents('cfg.json', file_get_contents('php://input'));
echo json_encode(array('success' => true));
