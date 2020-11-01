<?php

DOS::requireSession('_admin');

$name = $data['name'];

return DOS::$db->query("SELECT * FROM ${name}");

?>