<script>

    window.call = function( method, callback, data, get, preventUrlParsing ){

        var dateParser = function( r ){

            if( Array.isArray(r) ) {
                r.forEach( dateParser );
                return;
            }

            for(var x in r){
                var o = r[x];
                if( typeof o == 'string' && o.match(/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d/)) r[x] = new Date(o);
            }

        }

        callback = callback || function(r){ console.log(r) };

        var x = new XMLHttpRequest();

        x.onreadystatechange = function() {
            if(x.readyState == 4) {
                if(x.status == 200) {
                    if( callback ){
                        var r = x.responseText;
                        try{
                            r = JSON.parse(r);
                            if( typeof r == 'object' ) dateParser(r);
                        }catch(e){

                        }
                        callback(r);
                    }
                }
            }
        };

        var url = method.indexOf('http') == 0 ? method : ('api/' + method);

        if(preventUrlParsing) url = method;

        // Make request
        x.open(get?'GET':'POST', url , true);
        x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        x.send( JSON.stringify(data) );

    }

    
</script>