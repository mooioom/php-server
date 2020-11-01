<?php

    include_once(LIBS.'jdb.php');

    $db = new JDB( DOS::getPath('db') );

    // $jdb->create('users');

    // $jdb->insert('users',[
    //     "username" => "admin",
    //     "password" => "1"
    // ]);

    $user = $db->select('users',['name' => $data['username'], 'password' => $data['password']]);

    if( $user ) $_SESSION['_admin'] = $user;

    return $user;

?>