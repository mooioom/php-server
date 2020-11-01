window.Menu = function (setup) {

    var $menu = this;

    var setup = setup || {};

    this.$element = setup.$element;
    this.$element.className += ' menu';
    
    this.items = [];
    this.namedItems = {};

    this.selected = null;

    this.onclick = setup.onclick;

    var $el = function(a,b,c,d){
        var el = document.createElement(a||'div');
        el.className = 'menu-'+b;
        if(c) c.appendChild(el);
        if(d) for(var x in d) el[x] = d[x];
        return el;
    }

    var Item = function(s,p){

        s = s || {};

        s.item = this;

        this.setup = s;

        this.title = s.title;

        this.icon = s.icon;
        this.name = s.name;

        var onclick = $menu.onclick || s.onclick;

        this.onclick = onclick.bind(null,this);

        this.$element = $el('div','item',p?p.$element.$items:$menu.$element);

        if( s.class ) this.$element.classList.add(s.class);

        this.$element.$icon     = $el('div','icon',this.$element);
        this.$element.$title    = $el('div','title',this.$element,{innerHTML:this.title});
        this.$element.$shortcut = $el('div','shortcut',this.$element);
        this.$element.$items    = $el('div','items',this.$element);

        this.$element.$clear    = $el('div','clear',this.$element);

        if( s.toggle ){
            this.$element.onclick = function(){
                this.onclick && this.onclick();
                var t = this.$element.classList.contains('menu-item-toggled');
                this.$element.classList[t?'remove':'add']('menu-item-toggled');
            }.bind(this);
        }else{
            this.$element.onclick = this.onclick;
        }

        this.select = function(){

            if($menu.selected) $menu.selected.unselect();
            $menu.selected = this;
            this.$element.classList.add('menu-item-selected');

        }.bind(this);

        this.unselect = function(){
            this.$element.classList.remove('menu-item-selected');
        }

        for(var x in s.items) new Item(s.items[x],this);

        $menu.items.push(this);

        if(s.name) $menu.namedItems[s.name] = this;

    }

    for(var x in setup.items) new Item(setup.items[x]);

}