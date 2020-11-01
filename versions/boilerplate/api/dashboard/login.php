<?php

$key      = $data['key'];
$password = $data['password'];

if(!$key || !$password) return false;

$user = DOS::$db->query("SELECT * FROM users WHERE (email='${key}' OR username='${key}') AND password='${password}'",1);

if(!$user) return false;

$_SESSION['user'] = $user;

DOS::log( 'login success' );

return true;

?>