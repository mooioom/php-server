<?php

class JDB{

    public $path;

    function JDB( $path = __DIR__.'/jdb/' ){
        $this->path = $path;
        if( !file_exists($this->path) ) mkdir($this->path);
    }

    function p($t){
        return $this->path.$t.'.json';
    }

    function get($t){
        if( !file_exists($this->p($t)) ) return [];
        return json_decode(file_get_contents( $this->p($t) ));
    }

    function set($t,$c){
        return file_put_contents( $this->p($t), json_encode($c,JSON_PRETTY_PRINT|JSON_NUMERIC_CHECK) );
    }

    function create( $t, $d = [] ){
        $s = file_put_contents( $this->p($t), json_encode($d) );
        return $s;
    }

    function destroy(){
        $files = glob($this->path.'*'); // get all file names present in folder
        foreach($files as $file){ // iterate files
        if(is_file($file))
            unlink($file); // delete the file
        }
    }

    function delete( $t ){
        $s = unlink( $this->p($t) );
        return $s;
    }

    function insert( $t, $d = null ){
        if($d) $d['__uid'] = $t.'_'.$this->uid();
        $c = $this->get($t);
        array_push($c,$d);
        $s = $this->set($t,$c);
        if($s) return $d['__uid'];
    }

    function update($t,$conditions,$u){
        $c = $this->get($t);
        $affected = 0;
        $this->search($c,$conditions,function($object) use (&$c,$u,&$affected){
            $affected++;
            foreach ($u as $key => $value) {
                $object->$key = $value;
            }
        });
        $this->set($t,$c);
        return $affected;
    }

    function remove($t,$conditions){
        $c = $this->get($t);
        $this->search($c,$conditions,function($object,$key) use (&$c){
            unset($c[$key]);
        });
        $this->set($t,$c);
    }

    function search( $c, $conditions = [], $fn ){
        $l = count($conditions);
        foreach ($c as $key => $object) {
            $f = 0;
            foreach ($conditions as $k => $v) {
                if( property_exists($object,$k) && ($object->$k == $v) ){
                    $f++;
                    if( $f==$l ) $fn($object,$key);
                }else break;
            }
        }
    }

    function select( $t, $conditions = [] ){
        $c = $this->get($t);
        $r = [];
        $this->search($c,$conditions,function($object) use (&$r){
            array_push($r,$object);
        });
        if (count($r) == 0) return false;
        if (count($r) == 1) return $r[0];
        return $r;
    }

    function count($t){
        $c = $this->get($t);
        return count($c);
    }

    function uid($length = 20) {
        $c = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $cl = strlen($c);
        $uid = '';
        for ($i = 0; $i < $length; $i++) {
            $uid .= $c[rand(0, $cl - 1)];
        }
        return $uid;
    }

}

/*

$db = new JDB();

$db->create('users');
$db->create('pages');

$user_uid = $db->insert('users',[
    'name' => 'a',
    'password' => 'hello world',
    'pages'  => []
]);

$user_uid = $db->insert('users',[
    'name' => 'b',
    'password' => 'hello world',
    'pages'  => []
]);

_log($user_uid,'1');

$page_uid = $db->insert('pages',[
    'name' => 'page 1',
    'content' => 'hello world',
    'users'  => [$user_uid]
]);

_log($page_uid);

$user = $db->select('users',['name'  => 'a']);
$page = $db->select('pages',['users'  => [$user_uid]]);

$db->update('users',['name'  => 'b'],['pages' => [$page->__uid]]);
$db->remove('users',['name'  => 'a']);

_log($user);
_log($page);

*/