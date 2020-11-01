window.Tabs = function( s ){

    var _tabs = this;

    s = s || {};

    var DEFAULTS = {

        $buttons : document.createElement('div'),   // the container for the tab buttons
        $tabs    : document.createElement('div'),   // the container for the tabs

        beforeselect : function(){},
        afterselect  : function(){},

        tabs : [
            {
                name : 'tab1',
                title : 'Tab 1',
                $element : 'Tab 1 Content'
            },
            {
                name : 'tab2',
                title : 'Tab 2',
                $element : 'Tab 2 Content'
            }
        ],

        init : 'tab1'

    }

    for(var x in DEFAULTS) if(typeof s[x] == 'undefined') s[x] = DEFAULTS[x];

    this.settings = s;

    this.tabs = [];

    this.current = null;

    this.$tabs    = this.settings.$tabs;
    this.$buttons = this.settings.$buttons;

    this.$tabs.classList.add('tabs-stage');
    this.$buttons.classList.add('tabs-buttons');

    this.allTabs = function( callback ){

        this.tabs.forEach(function(tab){
            callback(tab);
        })

    }.bind(this);

    this.setByName = function( name ){

        if( this.tabs[name] ) this.tabs[name].select();

    }.bind(this);

    var Tab = function( s ){

        s = s || {};

        this.name     = s.name;
        this.title    = s.title;
        this.isButton = s.isButton;

        this.onselect = s.onselect;

        this.$button = document.createElement('div');
        this.$button.classList.add('tabs-button');
        this.$button.innerHTML = this.title;

        this.$element = document.createElement('div');
        this.$element.classList.add('tab');

        this.$stage = _tabs.settings.$tabs;

        this.show = function(){

            this.$button.classList.add('tabs-button-selected');

        }

        this.hide = function(){

            this.$button.classList.remove('tabs-button-selected');

        }

        this.select = function(){

            if( this.isButton ){
                this.onselect && this.onselect( this );    
                return;
            }

            _tabs.allTabs(function(t){ t.hide() })

            this.show();

            _tabs.current = this;

            _tabs.settings.beforeselect&&_tabs.settings.beforeselect(this);
            this.onselect && this.onselect( this );
            _tabs.settings.afterselect&&_tabs.settings.afterselect(this);

        }.bind(this)

        this.$button.onclick = function( event ){

            event.stopPropagation();

            this.select();

        }.bind(this);

    }

    this.init = function(){

        this.settings.$buttons.innerHTML = '';
        this.settings.$tabs.innerHTML = '';

        this.settings.tabs.forEach(function( tabSetup ){

            var tab = new Tab( tabSetup );

            if(tab.name) this.tabs[tab.name] = tab;

            this.tabs.push(tab);

            this.$buttons.appendChild( tab.$button );

        }.bind(this));

        if( this.settings.init && this.tabs[ this.settings.init ] ) this.tabs[ this.settings.init ].select();
        else if( this.tabs[0] ) this.tabs[0].select();

    }

    this.init();

}