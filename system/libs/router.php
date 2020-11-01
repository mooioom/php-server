<?php

class Router{

    public $routes = [];

    function route( $pattern, $callback ){

        $pattern = '(.*)/'.$pattern;

        $pattern = '/^' . str_replace('/', '\/', $pattern) . '$/';
		$this->routes[$pattern] = $callback;

    }

    function start( $uri = null ){

        if(!$uri) $uri = $_SERVER["PATH_INFO"];

        foreach ($this->routes as $pattern => $callback) {
            //echo $pattern.'<br/>';
			if (preg_match($pattern, $uri, $params)){
                //print_r($params);
                //$p = array_slice($params, 2); 
                $p = array_reverse($params);
                $r = call_user_func_array($callback, array_values($p));
				return $r;
			}
		}
        
    }

}