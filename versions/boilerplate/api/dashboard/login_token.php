<?php

$token = $data['token'];

$user_id = DOS::api('dashboard/check_token',['token'=>$token,'type'=>2]);

if(!$user_id) return false;

$user = DOS::$db->query("SELECT * from users where id = '${user_id}' LIMIT 1", true);

if(!$user) return false;

DOS::$db->query("DELETE FROM tokens where token = '${token}' and user_id = '${user_id}'", true);

$_SESSION['user'] = $user;

return true;

?>