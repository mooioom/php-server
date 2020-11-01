<?php

$token = $data['token'];
$type  = $data['type'];

if(!$token) return false;
if(!$type) $type = 1;

$hour_ago = Utils::date('-1 hour');

$token = DOS::$db->query("SELECT * from tokens where token = '${token}' and type = '${type}' and date > '${hour_ago}' LIMIT 1", true);

if(!$token) return false;

return $token['user_id'];

?>