<?php

session_start();

include_once 'libs/router.php';
include_once 'libs/db.php';

const ROOT = __DIR__.'/../';

const SYSTEM   = ROOT.'system/';
const VERSIONS = ROOT.'versions/';
const CLIENT   = SYSTEM.'client/';
const LIBS     = SYSTEM.'libs/';

const SETTINGS_FILE = SYSTEM.'settings.json';

class DOS{

    static $db = null;

    static $version;

    static $settings = [];

    static $public_path;
    static $public_filetypes = [
        "js"   => "text/javascript",
        "css"  => "text/css",
        "jpeg" => "image/jpeg",
        "jpg"  => "image/jpeg",
        "json" => "application/json",
        "html" => "text/html",
        "ttf"  => "application/x-font-ttf",
        "svg"  => "image/svg+xml"
    ];

    public $router;

    function DOS(){

        self::$settings = $this->getSettings();

        self::$version = self::$settings->app->version;

        self::$db = new DB(
            self::$settings->db->server,
            self::$settings->db->user,
            self::$settings->db->password,
            self::$settings->db->db
        );

        $this->route();

    }

    function requireSession( $var = '_admin' ){
        if(!isset( $_SESSION[$var] )){ http_response_code(403); exit; }
    }

    function api( $method, $data = null ){
        if(!isset($data)) $data = Utils::postData();
        $r = include( $this->getPath('api').$method.'.php' );
        if($r) return $r;
        return null;
    }

    function getSettings(){
        return Utils::getJson( SETTINGS_FILE );
    }

    function setSettings(){
        $json_string = json_encode(DOS::$settings, JSON_PRETTY_PRINT );
        $fp = fopen(SYSTEM.'settings.json','w');
        $status = fwrite($fp,$json_string);
        fclose($fp);
        return $status;
    }

    function getPath( $type = '' ){
        $version = self::$version;
        return VERSIONS.$version.'/'.$type.'/';
    }

    function getFile( $path, $content_type, $type ){

        if( !file_exists($path) ) return http_response_code(404);

        if( $type == 'ttf' ){
            header_remove('Expires');
            header_remove('Cache-Control');
            header_remove('Pragma');
            header('Last-Modified: Tue, 02 Apr 1900 16:35:34 GMT');
        }

        header('content-type:'.$content_type);

        include( $path );
    }

    function jsonError( $msg, $type = 1 ){
        Utils::toJson([
            "error"      => true,
            "error_type" => $type,
            "message"    => $msg
        ]);
        exit;
    }

    function routeFiles(){

        foreach ( self::$public_filetypes as $type => $content_type) {

            $this->router->route( '(.*).'.$type, function( $file, $path ) use($type, $content_type){

                $base = $this->getPath('public');

                if( substr( $path, 0, strlen('/__') ) == '/__' ) {

                    preg_match('/\/__([^\/]*)\//',$path,$re);

                    $version = $re[1];

                    $base = VERSIONS.$version.'/public/';

                    $path = str_replace( '/__'.$version, '', $path);

                }

                $this->getFile( $base.$path.'/'.$file.'.'.$type, $content_type, $type );

            });

        }

    }

    function route(){

        $this->router = new Router;

        $r = $this->router;

        $r->route( 'api/__(.*)/(.*)', function( $method, $version ){
            DOS::$version = $version;
            Utils::toJson( $this->api( $method ));
        });

        $r->route( 'api/(.*)', function( $method ){
            Utils::toJson( $this->api( $method ));
        });

        $this->routeFiles();

        $r->route( '__(.*)/(.*)', function( $view, $version ){
            DOS::$version = $version;
            VIEW::load( $view );
        });

        $r->route( '__(.*)', function( $version ){
            DOS::$version = $version;
            VIEW::load( 'index' );
        });

        $r->route( '(.*)', function( $view ){
            $view = $view ? $view : 'index';
            VIEW::load( $view );
        });

        $r->start();

    }

    function token( $user_id, $token_type_id = 0 ){

        $uid = Utils::uid(45);

        $data = [
            'type'    => $token_type_id,
            'token'   => $uid,
            'user_id' => $user_id
        ];

        if(!DOS::$db->insert('tokens',$data)) return false;

        return $uid;

    }

    function mail( $email, $subject = 'Email Subject', $template = 'general', $template_data = [], $body = false ){

        $msg = '';

        $msg = $body ? $body : Template::load( $template, $template_data );

        //$r = mail($email,$subject,$msg);

        $r = true;

        return $r;

    }

    function log( $description, $type = 1 ){

        $data = [
            "log_type_id"       => $type,
            "description"       => $description,
            "remote_address"    => $_SERVER['REMOTE_ADDR'],
            "uri"               => $_SERVER['REQUEST_URI'],
            "referer"           => $_SERVER['HTTP_REFERER'],
            "datetime"          => Utils::date(),
            "post_vars"         => file_get_contents("php://input"),
            "is_post"           => ($_SERVER['REQUEST_METHOD'] == 'POST') ? 1 : 0,
            "query_string"      => $_SERVER['QUERY_STRING'],
            "useragent"         => $_SERVER['HTTP_USER_AGENT']
        ];

        return DOS::$db->insert('logs',$data);

    }

}

class View{

    public $view;

    function __construct( $view, $autoload = false ){

        $this->view = $view;

        if($autoload) $this->load();

    }

    function load( $view, $view_settings = [], $prevent_api_loading = false ){
        if(!$prevent_api_loading) include CLIENT.'api.php';
        $f = DOS::getPath('views').$view.'.php';
        if( !file_exists( $f ) ) return http_response_code(404);
        include $f;

    }

    function exist( $name ){
        return file_exists( $name.'.php' );
    }

}

class Template{

    function load( $template, $data ){
        $f = DOS::getPath('templates').$template.'.php';
        if( !file_exists( $f ) ) return '';
        ob_start();
        include $f;
        return ob_get_clean();
    }

}

class Utils{

    function uid($length = 20) {
        $c = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $cl = strlen($c);
        $uid = '';
        for ($i = 0; $i < $length; $i++) {
            $uid .= $c[rand(0, $cl - 1)];
        }
        return $uid;
    }

    function date( $s = 0 ){
        return date('Y-m-d H:i:s', is_string($s) ? strtotime($s) : time() + $s );
    }

    function getJson($path){
        return json_decode(file_get_contents($path));
    }

    function toJson( $o ){ echo json_encode($o); }

    function postData(){
        $data = trim(file_get_contents("php://input"));
        $data = json_decode($data, true);
        return $data;
    }

}

class Validation{

    function test( $data = null, $required = [] ){

        if(!$data) return false;

        foreach ($required as $key => $value) {

            if(!isset($data[$key])) return false;

            if(!call_user_func('Validation::'.$value,$data[$key])) return false;

        }

        return true;

    }

    function alphabet($in){
        return preg_match("/^[a-zA-Z ]*$/",$in);
    }

    function password($in){
        return true;
    }

    function email($in){
        return filter_var($in,FILTER_VALIDATE_EMAIL);
    }

    function url($in){
        return filter_var($in,FILTER_VALIDATE_URL);
    }

    function ip($in){
        return filter_var($in,FILTER_VALIDATE_IP);
    }

}

new DOS;

?>