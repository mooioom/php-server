<?php

$token    = $data['token'];
$password = $data['password'];

if(!$token || !$password) return false;

$user_id = DOS::api('dashboard/check_token',['token'=>$token,'type'=>1]);

if(!$user_id) return false;

$user = DOS::$db->query("SELECT * from users where id = '${user_id}' LIMIT 1", true);

if(!$user) return false;

$update = DOS::$db->query("UPDATE users set password = '${password}' where id = '${user_id}'");

if(!$update) return false;

$user = DOS::$db->query("SELECT * from users where id = '${user_id}' and password = '${password}' LIMIT 1", true);

if($user) DOS::$db->query("DELETE FROM tokens where token = '${token}' and user_id = '${user_id}'", true);

return $user ? true : false;

?>