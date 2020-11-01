/**
 * @class Cart
 * @param {*} s cart init setup
 * @requires DOM
 */
window.Cart = function( s ){

    s = s || {};

    this.$container = s.$container || document.body;

    this.itemrenderer = s.itemrenderer || function( item, $item ){};

    this.$cart = DOM('#cart',{

        '/.cart-head' : {
            name : 'head',
            '/table' : {
                '/tr' : {
                    '/td.cart-head-left' : {
                        '/.cart-logo' : {
                            name : 'logo'
                        },
                        '/.cart-title' : {
                            name : 'title'
                        }
                    }
                }
            }
        },
        '/.cart-body' : {
            name : 'body',
            '/.cart-body-items' : {
                name : 'items',
            },
            '/.cart-checkout-button' : {
                name : 'checkout',
                '/.cart-checkout-button-icon' : {

                },
                '/.cart-checkout-button-text' : {
                    innerHTML : 'Checkout'
                }
            }
        }

    })

    //if(!s.menu) this.$cart.$menu.classList.add('hidden');

    this.$container.appendChild(this.$cart);

    // should be saved in session in case user leaves & returns

    this.items = [];

    this.maximized = false;

    this.add = function( item ){

        var cartItem = new Cart.Item({
            data     : item,
            renderer : this.itemrenderer,
            cart     : this
        })

        this.items.push(cartItem);

        this.render();

        return cartItem;

    }

    this.remove = function( item ){

        this.items.splice( this.items.indexOf(item), 1 );

        this.render();

    }

    // goto checkout
    this.checkout = function(){

        s.oncheckout && s.oncheckout( this );

    }.bind(this);

    this.maximize = function(){

        this.maximized = true;

        this.$cart.classList.add('maximized');

    }.bind(this);

    this.minimize = function(){

        this.maximized = false;

        this.$cart.classList.remove('maximized');

    }.bind(this);

    this.render = function(){

        this.$cart.$items.innerHTML = '';

        if(!this.items.length){
            this.$cart.$title.innerHTML = 'Cart Empty';
            this.$cart.$checkout.classList.add('hidden');
            this.$cart.classList.add('cart-empty');
            return;
        }

        this.$cart.$title.innerHTML = '<b>'+this.items.length + '</b> Items in cart';

        this.$cart.$checkout.classList.remove('hidden');
        this.$cart.classList.remove('cart-empty');

        this.items.slice().reverse().forEach(function(item){

            this.$cart.$items.appendChild( item.$element );

            item.render();

        }.bind(this))

        

    }

    this.$cart.$head.onclick = function( e ){

        e.stopPropagation();

        this.maximized ? this.minimize() : this.maximize();

    }.bind(this);

    this.$cart.$checkout.onclick = this.checkout;

    this.render();

    this.maximize();

}

Cart.Item = function( s ){

    s = s || {};

    this.$element = DOM('.cart-item');

    this.data     = s.data;
    this.renderer = s.renderer;
    this.cart     = s.cart;

    this.render = function(){

        this.$element.innerHTML = '';

        this.renderer.call(null,this);

    }

    this.remove = function(){

        this.cart.items.splice( this.cart.items.indexOf(this), 1 );
        this.cart.render();

    }

}