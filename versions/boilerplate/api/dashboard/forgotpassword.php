<?php

// todo:: security

$email = $data['email'];

if(!$email) return false;

$user = DOS::$db->select('users',['email'=>$email]);

if(!$user) return false;

$token = DOS::token($id,1);

if( $token && DOS::mail($email, 'Forgot Password', 'forgot_password', ['token'=>$token]) ){

    return true;

}

return false;

?>