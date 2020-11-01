<?php

class DB{

    public $server = "localhost";

    public $user     = "";
    public $password = "";

    public $db = "";

    public $connection;

    function DB( $server = '', $user = '', $password = '', $db = '' ){

        $this->server   = $server;
        $this->user     = $user;
        $this->password = $password;
        $this->db       = $db;

        $this->connection = new mysqli(
            $this->server, 
            $this->user, 
            $this->password, 
            $this->db
        );

    }

    function query( $sql, $return_single = false ){

        $result = $this->connection->query($sql);

        if( is_bool($result) || is_int($result) ) return $result;

        if(!$result) return false;

        $r = [];

        while($row = $result->fetch_assoc()) {
            $r[] = $row;
        }

        if( $return_single ) {
            return count($r) ? $r[0] : false;
        }
        
        return $r;

    }

    function insert( $table, $data ){

        $keys = implode(',',array_keys($data));
        $values = implode("','",array_values($data));

        $q = "INSERT INTO ${table} (${keys}) VALUES ('${values}')";

        $result = $this->connection->query($q);

        if($result) return $this->connection->insert_id;

    }

    function getWhereString( $where ){
        $a = [];
        foreach ($where as $key => $value) { array_push($a,"${key}='${value}'"); };
        return implode(' AND ', $a);
    }

    function select( $table, $where, $return_fields = null ){

        $fields = $return_fields ? implode(',',$return_fields) : '*';

        $where_string = $this->getWhereString($where);

        $q = "SELECT * FROM ${table} WHERE ${where_string}";

        return $this->query($q,true);

    }

    function delete( $table, $where ){

        $where_string = $this->getWhereString($where);

        $q = "DELETE FROM ${table} WHERE ${where_string}";

        return $this->query($q,true);

    }

}