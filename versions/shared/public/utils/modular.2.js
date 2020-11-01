window.Modular = {

    modules : {},

    base : 'dashboard',

    Module : function( s ){

        var $module = this;

        s = s || {};

        this.constructor = {};
        this.scope       = s.scope || {};

        var _ = this.constructor;

        Modular[ '_'+s.module ] = _;

        _.setup = s;

        _.$element = s.$element || document.createElement('div');

        _.isLoaded = false;

        _.data = s.data;
        this.scope.data = s.data || {};

        for(var x in s) _[x] = s[x];

        _.scripts = [];
        _.styles  = [];
        _.modules = [];
        _.fn      = [];

        if( s.fn ) _.fn.push(s.fn);

        this.scope.$element = _.$element;
        this.scope.module = this;

        _.scope = this.scope;
        this.scope._ = _;

        String.addSlash = function(str){
            str.substring(str.length,str.length-1) == '/' ? '' : str += '/';
            return str;
        }

        var base = Modular.base ? Modular.base : '';
        if( typeof s.base != 'undefined' ) base = s.base;

        if(base) base = String.addSlash(base);

        var path = 'modules';
        if( typeof s.path != 'undefined' ) path = s.path;

        if(path) path = String.addSlash(path);

        require.HTML( base+path+_.setup.module+'.html', function( html ){

            _.$module = document.createElement('module');
            _.$module.innerHTML = html;

            _.$element.appendChild(_.$module);

            if( _.$element.hasAttribute('module-prevent-load') ) {
                if( _.onload ) _.onload();
                return;
            }

            _.load();

        }.bind(_));

        _.load = function( onload ){

            onload = onload || _.onload;

            var require_sync  = [];
            var require_async = [];

            _.scripts = _.$module.querySelectorAll('script');
            _.styles  = _.$module.querySelectorAll('link[rel="stylesheet"]');
            _.modules = _.$module.querySelectorAll('[module]');
            _.binds   = _.$module.querySelectorAll('[id],[bind]') || [];

            _.binds.forEach(function(bind){ 
                this.scope[ '$' + (bind.id||bind.getAttribute('bind')) ] = bind; 
            }.bind(_));

            _.scripts.forEach(function(script){

                if( script.src ) {
                    if( script.getAttribute('async') ) return require_async.push( script.src );
                    return require_sync.push( script.src );
                }

                if(  script.hasAttribute('preload') ) return new Function(script.innerHTML).call(_.scope);

                _.fn.push( new Function(script.innerHTML) )

            }.bind(_));

            var go = function(){

                var modules_sync  = [];
                var modules_async = [];

                var go_fn = function(){

                    _.fn.forEach(function(fn){

                        fn.call( this.scope );
    
                    }.bind(_));

                    _.isLoaded = true;

                    if( onload ) onload();

                }.bind(_);

                _.modules.forEach( function( module ){

                    _.modules[ module.getAttribute('module') ] = module;

                    if( module.getAttribute('async') ) modules_async.push( module );
                    modules_sync.push( module );

                });

                modules_async.forEach(function( module ){
                    module.modular()
                });

                if( modules_sync.length ){

                    var l = modules_sync.length;

                    modules_sync.forEach(function( module ){

                        module.modular({

                            onload : function(){

                                l--;

                                if(!l) go_fn();

                            }

                        })

                    }.bind(_))

                }else {
                    go_fn();
                }

            }.bind(_)

            require( require_async );

            if(require_sync.length) require( require_sync, go);
            else go();

        }

        _.bind = function(){

        }

        return this.scope;

    },

    getHash : function(){

        var h = {};

        var hash = location.hash;

		if(!hash) return {};

		hash = hash.split('?')[0];

		hash.match(/#(.*)/)[1].split('&').forEach(function(s){
			h[s.split('=')[0]] = s.split('=')[1];
		}.bind(this));

        return h;

    },

    events : {},

    on : function( eventName, callback ){

        if(!Modular.events[eventName]) Modular.events[eventName] = [callback];
        else Modular.events[eventName].push(callback);

    },

    off : function( eventName, callback ){

        if(!Modular.events[eventName]) return;

        var events = Modular.events[eventName];

        events = events.splice( events.indexOf(callback), 1 );

    },

    broadcast : function( eventName ){

        if(!Modular.events[eventName]) return;

        Modular.events[eventName].forEach(function(ev){
            ev.apply(null,[].slice.call(arguments).slice(1))
        })

    }

}

window.addEventListener('hashchange',function(){})

Element.prototype.modular = function( s ){

    s = s || {};

    s.$element = this;
    s.module   = s.module || this.getAttribute('module');

    this._module = new Modular.Module(s);

    return this._module;

}

window.require = function( deps, onload ){

    deps = deps || [];

    var l = deps.length;

    if(!l) return;

    var go = function(){

        l--;

        if(!l) onload();

    }

    deps.forEach(function(dep){

        if (dep.search('(\\.|/)js($|\\?)') != -1) {

            require.JS(dep, go)

        }

    })

}

window.M = Modular;

require.cache = {};
require.base  = '';

require.XHR = function( path, onload, onerror ){

    var xhr = new XMLHttpRequest();

    var base = require.base ? require.base + '/' : '';

    xhr.open('GET', base+path);

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
        }, function( r ){
            onerror && onerror(r);
        }
    )

}

require.HTML = function( path, onload, onerror ){

    require.XHR( path, 
        function( r ){
            onload && onload(r);
        }, function( r ){
            onerror && onerror(r);
        }
    )

}

require.JS = function( src, onload, onerror ){

    var $script = document.createElement('script');

    $script.src = src;

    if(onload) $script.onload = onload;
    
    document.head.appendChild( $script );

}