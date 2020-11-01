window.Table = function( setup ){
    
    window.__table = this;

    var __table = this;

    setup = setup || {};

    var DEFAULTS = {

        $element : document.createElement('div'),

        headers : [],

        data : [],

        dateFormatter : function( date ){

            return date.toLocaleDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

        },

        // actions : [
        //     {
        //         title : '<i class="icon-lock" />',
        //         onclick : function( row, mouseEvent ){

        //             debugger;

        //         }
        //     }
        // ]

    }

    for(var x in DEFAULTS) setup[x] = typeof setup[x] == 'undefined' ? DEFAULTS[x] : setup[x];

    this.setup = setup;

    this.data = setup.data || [];

    this.$element = this.setup.$element;

    this.$element.classList.add('table-js');

    this.$table = document.createElement('table');
    this.$thead = document.createElement('thead');
    this.$tbody = document.createElement('tbody');

    this.$table.appendChild(this.$thead);
    this.$table.appendChild(this.$tbody);

    this.$element.appendChild( this.$table );

    
    this.headers = [];

    var Header = function( s ){

        s = s || {};

        for(var x in s) this[x] = s[x];

    }

    this.setHeaders = function(){

        this.setup.headers.forEach(function(h){
            var header = new Header(h);
            __table.headers.push(header);
        });

        if(!this.headers.length && this.data.length){

            for(var x in this.data[0]){

                var header = new Header({
                    name  : x
                });

                __table.headers.push(header);

            }

        }

        if( this.setup.actions ){
            __table.headers.push(new Header({
                title : 'Actions',
                actions : this.setup.actions
            }));
        }

    }

    this.init = function(){

        this.setHeaders();
        this.render();

    }

    this.renderHead = function(){

        this.$thead.innerHTML = '';

        this.$thead.$tr = document.createElement('tr');
        this.$thead.appendChild( this.$thead.$tr );
        
        this.headers.forEach(function(h){

            var $th = document.createElement('th');

            $th.innerHTML = h.title || h.name;

            this.$thead.$tr.appendChild($th);

        }.bind(this))

    }

    this.renderBody = function(){

        this.$tbody.innerHTML = '';

        this.data.forEach(function( row ){

            var $tr = document.createElement('tr');

            this.headers.forEach(function(h){

                var data = row[h.name];

                var html = data || '';

                if( data instanceof Date ){

                    if( h.dateFormatter ) html = h.dateFormatter( data );
                    else{
                        html = __table.setup.dateFormatter(data);
                    }

                }

                var $td = document.createElement('td');
                $td.innerHTML = html;

                if( h.actions ){

                    $td.classList.add('table-actions');

                    h.actions.forEach(function(action){

                        if( action.condition && !action.condition(row) ) return;

                        var $action = document.createElement('div');

                        $action.classList.add('table-actions-action');

                        $action.innerHTML = action.title;

                        $action.onclick = action.onclick.bind(this,row);

                        $td.appendChild($action);
                        
                    })

                }
                
                $tr.appendChild($td);

            }.bind(this));

            this.$tbody.appendChild( $tr );

        }.bind(this))

    }

    this.render = function(){

        this.renderHead();
        this.renderBody();

    }

    this.init();

}