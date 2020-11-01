<?php

if( isset( $_SESSION['_admin'] ) ) return VIEW::load('dashboard');

VIEW::load('login');

?>