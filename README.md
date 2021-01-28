# php-server
 PHP Server

A PHP Server Framework

## Features
<ul>
    <li>Multiple Versions Support</li>
    <li>Shared Resources Folder</li>
    <li>Router</li>
    <li>Views</li>
    <li>Controllers</li>
    <li>DB - MySQL</li>
    <li>DB - JSON DB</li>
    <li>XHR / Client API</li>
    <li>Built-in Emailer</li>
    <li>Validation</li>
    <li>App Boilerplate</li>
    <li>Admin Dashboard Boilerplate</li>
</ul>

## DOS.php - Developers Operating System
The main framework class file can be found at :

    system/dos.php

## Installation
clone the repository and start the apache server

## Basic Setup
Basic setup / settings file can be found here :

    system/settings.json

    {
        "app": {
            "version": "boilerplate"
        },
        "db": {
            "server": "localhost",
            "user": "root",
            "password": "",
            "db": "basic"
        }
    }

## Json Database
A tiny JSON type database for basic applications

Usage example :

    $db = new JDB( DOS::getPath('db') );

    $user = $db->select('users',['name' => $data['username'], 'password' => $data['password']]);
    if( $user ) $_SESSION['_admin'] = $user;

