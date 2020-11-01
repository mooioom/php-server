<?php

$versions = [];

$o = array_diff(scandir(VERSIONS),['.','..','admin','shared']);

$current = DOS::$settings->app->version;

foreach ($o as $key => $value) {

    array_push($versions,['version'=>$value,'production'=>($current==$value)]);

}

return $versions;

?>