/**
 * @class HoverMenu
 * @param {*} s 
 */
window.HoverMenu = function( s ){

    var _hovermenu = this;

    var DEFAULTS = {

        icons_prefix : 'icon-',

        $element : document.createElement('div'),

        items : [
            {
                title : 'Home',
                icon  : 'home',
                onclick : function(){
                    console.log('home')
                }
            }
        ]

    };

    for(var x in DEFAULTS) if(typeof s[x] == 'undefined') s[x] = DEFAULTS[x];

    this.settings = s;

    this.$element = this.settings.$element;

    this.items = [];

    var Item = function( s ){

        s = s || {};

        this.name = s.name;

        this.title   = s.title;
        this.icon    = s.icon;
        this.onclick = s.onclick;

        this.$element = document.createElement('div');
        this.$element.classList.add('hover-menu-item');

        this.$icon = document.createElement('i');
        this.$element.appendChild( this.$icon );

        this.$icon.classList.add( _hovermenu.settings.icons_prefix + this.icon );

        this.$element.onclick = function( event ){

            event.stopPropagation();

            this.onclick&&this.onclick( this, event );

        }.bind(this);

        this.hide = function(){
            this.$element.style.display = 'none';
        }

        this.show = function(){
            this.$element.style.display = 'inline-block';
        }

    }

    this.init = function(){

        this.$element.classList.add('hover-menu');

        this.$items = document.createElement('div');
        this.$items.classList.add('hover-menu-items');

        this.$element.appendChild(this.$items);

        this.settings.items.forEach(function(itemSetup){

            var item = new Item(itemSetup);

            if(item.name) _hovermenu['_'+item.name] = item;

            this.$items.appendChild( item.$element );

            this.items.push(item);

        }.bind(this));



    }

    this.init();

};

Element.prototype.hovermenu = function( s ){

    s = s || {};

    s.$element = this;

    this._hovermenu = new HoverMenu(s);

}