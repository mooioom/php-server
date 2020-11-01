/**
 * @class Form
 * @param {*} s setup object
 * @example
 * 
 *
 *  var form = new Form({

    inputs : {
        'firstname' : {description : 'First Name', width : '50'},
        'lastname' : {description : 'Last Name', width : '50'},
        'email' : {description : 'Email', validation:'!isEmail(email)?"Please Fill Valid Email":false'},
        'password' : {description : 'Password', type:'password'},
        'retype'   : {description : 'Retype Password', type:'password', validation : 'password!=retype?"Passwords do not match":false'},
        'credit1' : {description:'Credit Card', width : '25'},
        'credit2' : {description:'.', width : '25'},
        'credit3' : {description:'.', width : '25'},
        'credit4' : {description:'.', width : '25'},
        'credit' : {
            hidden : true,
            value : 'credit1+credit2+credit3+credit4',
            validation : '!isCreditCard(credit)?true:false'
        }
    }
    
});

document.querySelector('.form').appendChild(form.$element);

 */

window.Form = function( s ){

    var _f = this;

    var DEFAULTS = {

        // title : 'Untitled Form',
        // description : 'This is the form description',

        submit : {
            title : 'Load',
            full  : true,
            onclick : function( data, validationErrors ){ console.log(data,validationErrors); }
        },

        data : {},

        inputs : {},

        element : document.createElement('div'),

        titles : false,

        width : 500,

        padding : 10,

        zoom : 1,

        rtl : false,

        theme : '',

        requiredText : 'This is Required'

        //onchange : function( data ){ console.log(data); },

        //oncreateinput : <fn> - whenever an input is created

    }

    var s = s || {};

    var settings = {};

    for(var x in s) if( typeof DEFAULTS[x] == 'undefined' ) DEFAULTS[x] = s[x];

    for(var x in DEFAULTS) settings[x] = typeof s[x] == 'undefined' ? DEFAULTS[x] : s[x];

    this.settings = settings;

    this.data = this.settings.data;

    this.inputs = {};

    this.$element = settings.element;
    this.$element.classList.add('form');

    if(this.settings.padding) this.$element.style.padding = this.settings.padding + 'px';
    if(this.settings.width) this.$element.style.width = this.settings.width + 'px';
    if(this.settings.rtl) this.$element.classList.add('form-rtl');

    if(this.settings.theme) this.$element.classList.add(this.settings.theme + '-theme');

    this.$element.style.zoom = this.settings.zoom;

    var $el = function(a,b,c,d){
        var $el = document.createElement(a);
        if(b) $el.className = b;
        if(c) for(var x in c) $el[x] = c[x];
        if(d) d.appendChild($el);
        return $el;
    }

    this.$title = $el('div','form-title-holder',{},this.$element);

    if(this.settings.title){
        this.$title.$title = $el('div','form-title',{
            innerHTML : this.settings.title
        },this.$title);
    }

    if(this.settings.description){
        this.$title.$description = $el('div','form-description',{
            innerHTML : this.settings.description
        },this.$title);
    }

    // utils

    var conditionChecker = function( data, condition, ownValue ){

        //debugger;

        var r = '';

        with(data){

            var $self = ownValue;

            function isEmail(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            }

            function isNumber(n) {
                var re = /^[0-9]+\.?[0-9]*$/;
                return re.test(String(n).toLowerCase());
            }

            function isAlphabet(n){
                var re = /^[a-zA-Z ]+$/;
                return re.test(String(n).toLowerCase());
            }

            function passwordStrength(p) {

                var strength = 0;
            
                strength += /[A-Z]+/.test(p) ? 1 : 0;
                strength += /[a-z]+/.test(p) ? 1 : 0;
                strength += /[0-9]+/.test(p) ? 1 : 0;
                strength += /[\W]+/.test(p) ? 1 : 0;

                if(!p) return 'Password Required';
            
                switch(strength) {
                    case 3:
                        return "it's medium!"
                        break;
                    case 4:
                        return false;
                        break;
                    default:
                        return "too weak!"
                        break;
                }

            }

            function isURL(n){
                var re = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
                return re.test(String(n).toLowerCase());
            }

            function isCreditCard(ccNum) {

                var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
                var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
                var amexpRegEx = /^(?:3[47][0-9]{13})$/;
                var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
                var isValid = false;
              
                if (visaRegEx.test(ccNum)) {isValid = true;} 
                else if(mastercardRegEx.test(ccNum)) {isValid = true;} 
                else if(amexpRegEx.test(ccNum)) {isValid = true;} 
                else if(discovRegEx.test(ccNum)) {isValid = true;}
              
                return isValid;

              }

            try{
                r = eval(condition); 
            }
            catch(e){
                return false;
            }
        }

        return r;

    }

    var conditionHandler = function( data, o, ownValue ){

        if( Array.isArray(o) ){

            response = [];

            for(var i=0;i<o.length;i++){
                var r = conditionHandler(data,o[i],ownValue);
                if(r) response.push(r);
            }

            return response.length ? response : false;

        }
        else if( typeof o == 'string' ){   
            return conditionChecker(data,o,ownValue); 
        }
        else if( typeof o == 'function' ){ 
            return o( data ); 
        }
        else if( typeof o == 'object' ){
            if(conditionChecker(data,o.condition,ownValue)) return o.message; 
        }

        return false;

    }

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };    

    // type / format
    // date            "yyyy-MM-dd"
    // datetime-local  "2019-03-14T11:00"

    function rgb2hex(rgb){
        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[0],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) : rgb;
    }

    var getColor = function(color){
        var c = $el('canvas');
        var t = c.getContext('2d');
        c.width=1;c.height=1;
        t.fillStyle=color;
        t.fillRect(0, 0, 1, 1);
        var d = t.getImageData(0, 0, 1, 1).data;
        return rgb2hex(d);
    }

    var inputElement = function( s, input ){

        var $input = $el('input');
        $input.type = s.type;

        if( Form.types[s.type] ) return Form.types[s.type].call(_f,s) || (function(){
            var d = document.createElement('input');
            d.setValue = function(){}
            d.getValue = function(){}
            console.error('Input Type:'+s.type+' Not Found!');
            return d;
        })();

        var changeEvent = 'keyup';

        if( s.type == 'select' ){

            var select = true;

            var $input = $el('select');
            changeEvent = 'change';

            if( s.multiple ){
                $input.multiple = s.multiple;
            }

            for(var i=0;i<s.options.length;i++){

                var o = s.options[i];
                var $option = $el('option');
                $option.innerHTML = o.title;
                $option.value = o.value;
                $input.appendChild($option);

            }

        }

        for(var setting in s) $input[setting] = s[setting];

        if(s.type == 'checkbox') changeEvent = 'click';

        if(
            s.type == 'date' ||
            s.type == 'time' ||
            s.type == 'datetime-local' ||
            s.type == 'color' ||
            s.type == 'range'
        ) changeEvent = 'change';

        if(s.type == 'number') changeEvent = 'change keyup';

        $input.getValue = function(){

            if(this.type == 'checkbox') return this.checked;
            if(this.type == 'number') return Number(this.value);

            if(select && s.multiple) 
                return [].map.call(this.selectedOptions,  function(elm){ return elm.value } );

            return this.value || '';

        }

        $input.setValue = function( value ){
            this.value = value || '';
            if(this.type == 'color') return this.value = getColor(value);
            if(this.type == 'checkbox') return this.checked = value;
            if(select && s.multiple && typeof value == 'object' ){
                value.forEach(function(v){
                    for(var i=0;i<this.options.length;i++){
                        var o = this.options[i];
                        if( o.value == v ) o.selected = true;
                    }
                }.bind(this));
            }
        }

        var changes = changeEvent.split(' ');

        for(var x in changes){
            var changeEvent = changes[x];
            $input.addEventListener(changeEvent,function(){
                _f.onchange();
            })
        }

        return $input;

    }

    var Input = function( property, settings, index ){

        var s = settings || {};

        if( typeof settings == 'text' ) s.type = settings;

        this.settings = s;

        this.property = property;
        this.title    = typeof s.title != 'undefined' ? s.title : property;

        this.visibility = s.visibility;
        this.validation = s.validation;

        this.value    = s.value;    // value calculation
        this.hidden   = s.hidden;   // hidden input
        this.excluded = s.excluded; // excluded from getData

        if(s.required) {

            var isRequired = function(data){ 
                if(!data[property] || typeof data[property] == 'undefined') return _f.settings.requiredText || 'This is Required'; 
            }

            if(!this.validation) this.validation = isRequired;
            else if( Array.isArray(this.validation) ) this.validation.push(isRequired);

        }

        var value = _f.data[property];

        this.type = s.type || 'text';

        this.$element = $el('table','form-input');
        this.$holder  = $el('tr');
        this.$element.appendChild(this.$holder);

        if(s.width) {
            this.$element.style.width = s.width + (!isNaN(s.width) ? '%' : '');
        }

        this.$title = $el('td','form-input-title');
        this.$value = $el('td','form-input-value');

        if( s.center ){
            this.$value.classList.add('input-center');
            this.$title.classList.add('input-center');
        }

        this.$title.innerHTML = this.title;
        if( _f.settings.titles ) this.$holder.appendChild(this.$title);

        if(s.icon) {
            this.$title.classList.add('form-input-icon');
            this.$title.classList.add('icon-'+s.icon);
            this.$title.innerHTML = '';
        }

        if(s.description){
            this.$description = $el('div','form-input-description');
            this.$description.innerHTML = s.description;
            this.$value.appendChild(this.$description);
        }

        this.$input = inputElement(this.settings,this);
        this.$value.appendChild(this.$input);

        this.$input.tabIndex = s.tabIndex || index;

        this.$holder.appendChild(this.$value);

        this.getValue = function( preventValueCalculation ){
            var value = this.$input.getValue();
            if( !preventValueCalculation && this.value ) {
                var data = _f.getData(true,true);
                value = conditionChecker(data,this.value,data[this.property]);
                this.setValue(value);
            }
            return value;
        }

        this.setValue = function( value ){
            this.$input.setValue( value );
        }

        this.setValue( value );

        if(this.validation){
            this.$validationHolder = $el('div','form-input-validation-holder');
            this.$validation = $el('div','form-input-validation');
            this.$validationHolder.appendChild(this.$validation);
            this.$value.appendChild(this.$validationHolder);
        }

        if(_f.settings.oncreateinput) _f.settings.oncreateinput(this,_f);

        if(this.hidden) this.$element.classList.add('form-hidden');

    }

    var eachInputs = function( callback ){
        for(var p in this.inputs) callback( this.inputs[p], p );
    }.bind(this);

    this.getData = function( preventValidation, preventValueCalculation ){

        var data = {};

        for(var x in _f.data) data[x] = _f.data[x];

        eachInputs(function(i,p){
            data[p] = i.getValue( preventValueCalculation );
        });

        if( !preventValidation ) this.validate(data);

        if( !preventValueCalculation ){
            eachInputs(function(i,p){
                if(i.excluded) delete data[p];
            });
        }

        return data;

    }

    this.validate = function( data ){

        var validation = {};
        var isValid = true;

        data = data || this.getData();

        eachInputs(function(i,p){

            if( i.visibility ){
                var f = conditionHandler( data, i.visibility, data[p] );
                i.$element.classList[ f ? 'remove' : 'add' ]('form-hidden');
                if(!f) delete data[p];
            } 

            if( i.validation && typeof data[p] != 'undefined' ){
                var v = conditionHandler( data, i.validation, data[p] );
                i.$validationHolder.hidden = (v === false || v === undefined);
                if( v !== false && typeof v != 'undefined' && v.length != 0 ) {
                    i.$validation.innerHTML = v;
                    validation[p] = v;
                    isValid = false;
                }
            }

        });

        return !isValid ? validation : undefined;

    }

    this.onchange = function(){

        console.log('form::change');

        var data = this.getData(true);

        var validation = this.validate(data);

        if( this.settings.onchange ) this.settings.onchange( data, validation );

    }

    // render
    this.render = function(){

        if( this.$form ) this.$element.removeChild(this.$form);

        var n = 1;

        for( var p in this.settings.inputs ){
            var input = new Input( p, this.settings.inputs[p], n );
            this.inputs[p] = input;
            n++;
        }

        this.$form = $el('div','form-inputs');
        for(var x in this.inputs) this.$form.appendChild( this.inputs[x].$element );

        this.$element.appendChild(this.$form);

        this.validate();

        if( this.settings.submit ){

            this.$buttons = $el('div','form-buttons',{},this.$element);
            this.$submit = $el('div','form-button',{
                innerHTML : this.settings.submit.title || 'Submit',
                onclick : function(){
                    this.settings.submit.onclick && this.settings.submit.onclick( this.getData(), this.validate() );
                }.bind(this)
            },this.$buttons);
            if( this.settings.submit.full ) this.$submit.style.width = '100%';

        }

    }

    this.render();

}

Element.prototype.Form = function(s){
    s.element = this;
    return new Form(s);
}

Form.types = {};

// custom input types

Form.types.toggle = function( settings ){

    $input = document.createElement('div');

    $input.classList.add('toggle-button');
    
    $input.style.display = 'inline-block';

    if( settings.toggleWidth )  $input.style.width  = settings.toggleWidth  + 'px';
    if( settings.toggleheight ) $input.style.height = settings.toggleheight + 'px';

    if( settings.color ){
        $input.style.backgroundColor = settings.color;
    }

    if( settings.toggleText ){
        $input.innerHTML = settings.toggleText;
    }

    $input.value = false;

    $input.getValue = function(){
        return this.value || false;
    }

    $input.setValue = function( value ){
        this.value = value || false;
        this.classList[ this.value ? 'add' : 'remove' ]('toggle-button-on');
    }

    $input.onclick = function($input){
        $input.setValue(!$input.value);
        this.onchange();
    }.bind(this,$input)

    return $input;

}

Form.types.switch = function( settings ){

    var $input = document.createElement('div');

    $input.classList.add('input-switch');
    
    $input.style.display = 'inline-block';
    $input.style.position = 'relative';

    if( settings.toggleWidth )  $input.style.width  = settings.toggleWidth  + 'px';
    if( settings.toggleheight ) $input.style.height = settings.toggleheight + 'px';

    if( settings.color ){
        $input.style.backgroundColor = settings.color;
    }

    var $rail = document.createElement('div');
    $rail.classList.add('input-switch-rail');

    var $knob = document.createElement('div');
    $knob.classList.add('input-switch-knob');

    $rail.appendChild($knob);
    $input.appendChild($rail);

    $input.value = false;

    $input.getValue = function(){
        return this.value;
    }

    $input.setValue = function( value ){
        this.value = value;
        this.classList[ this.value ? 'add' : 'remove' ]('input-switch-on');
    }

    $input.onclick = function($input){
        $input.setValue(!$input.value);
        this.onchange();
    }.bind(this,$input)

    return $input;

}

Form.types.textarea = function( settings ){

    var $input = document.createElement('textarea');

    $input.classList.add('input-textarea');
    
    $input.style.display = 'inline-block';
    $input.style.position = 'relative';

    if( settings.textWidth )  $input.style.width  = settings.textWidth  + 'px';
    if( settings.textHeight ) $input.style.height = settings.textHeight + 'px';

    if( settings.color ){
        $input.style.backgroundColor = settings.color;
    }

    $input.value = '';

    $input.getValue = function(){
        return this.value;
    }

    $input.setValue = function( value ){
        this.value = value;
    }

    $input.onkeyup = function($input){
        //$input.setValue(!$input.value);
        this.onchange();
    }.bind(this,$input)

    return $input;

}

Form.types.title = function( settings ){

    var $input = document.createElement('div');

    $input.classList.add('input-type-title');
    
    $input.style.display = 'inline-block';
    $input.style.position = 'relative';

    if( settings.titleWidth )  $input.style.width  = settings.titleWidth  + 'px';
    if( settings.titleHeight ) $input.style.height = settings.titleHeight + 'px';
    if( settings.color ) $input.style.color = settings.color;
    if( settings.text ) $input.innerHTML = settings.text;

    $input.value = '';

    $input.getValue = function(){
        return $input.innerHTML;
    }

    $input.setValue = function( value ){
        $input.innerHTML = value;
    }

    return $input;

}

Form.types.icons = function( settings ){

    var $input = document.createElement('div');

    $input.classList.add('input-icons');
    
    $input.style.display = 'inline-block';
    $input.style.position = 'relative';

    $input.items = [];
    $input.keys = {};

    $input.off = function(){
        $input.items.forEach(function($h){ 
            $h.off(); 
        });
    }

    for(var i=0;i<settings.options.length;i++){

        var o = settings.options[i];

        var $holder = document.createElement('table');

        $holder.classList.add('input-icon-holder');

        $holder.$tr = document.createElement('tr');
        $holder.appendChild($holder.$tr);

        $holder.$icon = document.createElement('td');
        $holder.$icon.classList.add('input-icon');
        $holder.$icon.classList.add('icon-'+o.icon);

        $holder.$tr.appendChild($holder.$icon);
        $input.appendChild($holder);

        if( settings.iconWidth ) $holder.style.width = settings.iconWidth;

        $holder.toggle = function(){ this.classList.toggle('input-icon-on');}
        $holder.on     = function(){ this.classList.add('input-icon-on');}
        $holder.off    = function(){ this.classList.remove('input-icon-on');}
        $holder.isOn   = function(){ return this.classList.contains('input-icon-on');}

        $input.items.push($holder);

        $holder.key = o.value || o.title || o.icon;

        $input.keys[o.value] = $holder;

        $holder.onmousedown = function( $holder, $input, o ){

            if( settings.multiple ){
                $holder.toggle();
            }else{
                $input.off();
                $holder.on();
            }

            this.onchange();

        }.bind(this,$holder,$input,o);

        if(o.title){
            $holder.$title = document.createElement('div');
            $holder.$title.classList.add('input-icon-title');
            $holder.$icon.appendChild($holder.$title);
            $holder.$title.innerHTML = o.title;
        }
    }

    $input.value = settings.multiple ? [] : '';

    $input.getValue = function(){
        var values = this.items.map(function(h){ return { key : h.key, value : h.isOn() } });
        var v = values.filter(function(v){return v.value});
        return settings.multiple ? v.map(function(v){ return v.key }) : (v.length ? v[0].key : undefined) ;
    }

    $input.setValue = function( value ){
        $input.off();
        $input.items.forEach(function($h){
            if( settings.multiple ){
                if( value.indexOf($h.key) != -1 ) $h.on();
            }else if( value == $h.key ) $h.on();
        });
        //this.onchange();
    }.bind(this)

    //

    return $input;

}

// more type : matrix, address (google map), range from-to, 