<?php

//error_reporting(0);

$required = [
    'firstname' => 'alphabet',
    'lastname'  => 'alphabet',
    'email'     => 'email',
    'password'  => 'password'
];

function error(){ return DOS::jsonError('Registration Failed'); }

$isValid = Validation::test($data,$required);

if(!$isValid) return error();

unset($data['retype']);

$user = DOS::$db->select('users',['email'=>$data['email']]);

if($user) return error();

$new_user_id = DOS::$db->insert('users',$data);

if(!$new_user_id) return error();

$token = DOS::token( $new_user_id, 2 );

if( !$token ) {
    DOS::$db->delete('users',['id'=>$new_user_id]);
    return error();
}

// send mail

return true;

?>