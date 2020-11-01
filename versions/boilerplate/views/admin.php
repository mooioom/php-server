<?php

if( isset( $_SESSION['user'] ) ) return VIEW::load('dashboard');

VIEW::load('login');

?>