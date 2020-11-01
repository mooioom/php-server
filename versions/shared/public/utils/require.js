window.require = function( deps, onload ){

}

require.cache = {};
require.que   = [];

require.isLoading = function( path ){

    var flag = false;

}

require.XHR = function( path, onload, onerror ){

    var que = function(){
        require.que.push({ path : path, onload : onload, onerror : onerror });
    }

    if( require.isLoading(path) ){
        return que();
    }else{
        que();
    }

    var xhr = new XMLHttpRequest();

    xhr.open('GET', path);

    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) {   // DONE
            if (xhr.status === 200) {
                onload && onload(xhr.responseText);
            } else { 
                onerror && onerror(xhr.responseText); 
            }
        }
    }

    xhr.send(null);

}

require.JSON = function( path, onload, onerror ){

    require.XHR( path, 
        function( r ){
            onload && onload(JSON.parse(r));
        }, function(){
            onerror && onerror(r);
        }
    )

}

require.HTML = function( path, onload, onerror ){

    require.XHR( path, 
        function( r ){
            onload && onload(r);
        }, function(){
            onerror && onerror(r);
        }
    )

}