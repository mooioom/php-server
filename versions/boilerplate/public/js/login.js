document.addEventListener('DOMContentLoaded',function(){

    var $status = DOM.$('.status');

    $status.hide = function(){
        this.classList.add('hide');
    }

    $status.show = function( msg ){
        this.classList.remove('hide');
        this.innerHTML = msg;
    }

    login.onclick = function(){

        $status.hide();

        var user = username.value;
        var pass = password.value;

        if(!user || !pass) {
            username.focus();
            return false;
        }

        call('dashboard/login',function( status ){

            if(status) location.reload();
            else {
                $status.show('Login failed, Please try again');
                username.focus();
            }

        },{
            key : user,
            password : pass
        })

    }

    forgotpassword.onclick = function(){

        var $body = DOM('div',{
            '/div' : {
                '/input' : {
                    name : 'input',
                    placeholder : 'Username / Email'
                }
            },
            '/div.fp-status.hide' : {
                name : 'status'
            }
        });

        $body.$status.hide = function(){
            this.classList.add('hide');
        }
    
        $body.$status.show = function( msg ){
            this.classList.remove('hide');
            this.innerHTML = msg;
        }

        var go = function(){

            $body.$status.hide();

            var value = $body.$input.value;

            if(!value) return $body.$input.focus();

            call('dashboard/forgotpassword',function( status ){

                $body.$status.show( status ? 'Done. Please check your email!' : 'Oops, please try again');

            },{
                email : value
            })

        }

        var modal = new Popup({
            modal : true,
            zIndex : 2,
            title : 'Forgot Password',
            body : $body,
            class : 'forgotpassword',
            oninit : function(){
                $body.$input.focus();
                $body.$input.addEventListener('keyup',function(ev){
                    if(ev.key=='Enter') go();
                })
            },
            buttons : [
                {
                    title : 'Send',
                    onclick : go
                }
            ]
        })

    }

    setpassword = function(){

        var $body = DOM('div',{
            '/div 1' : { '/input' : { type : 'password', name : 'password1', placeholder : 'Password', style : {marginBottom:'10px'} } },
            '/div 2' : { '/input' : { type : 'password', name : 'password2', placeholder : 'Retype Password' } },
            '/div.fp-status.hide' : { name : 'status' }
        });

        $body.$status.hide = function(){
            this.classList.add('hide');
        }
    
        $body.$status.show = function( msg ){
            this.classList.remove('hide');
            this.innerHTML = msg;
        }

        var go = function(){

            $body.$status.hide();

            var password1 = $body.$password1.value;
            var password2 = $body.$password2.value;

            if(!password1 || !password2) return;

            if(password1 != password2) return $body.$status.show('Passwords do not match');

            call('dashboard/set_password',function( status ){

                $body.$status.show( status ? 'Done! you can login with your new password' : 'Oops, something went wrong' );

            },{
                password : password1,
                token : __setpassword
            })

        }

        var modal = new Popup({
            modal : true,
            zIndex : 2,
            title : 'Set Password',
            body : $body,
            class : 'forgotpassword',
            oninit : function(){
                $body.$password1.focus();
                $body.$password1.addEventListener('keyup',function(ev){ if(ev.key=='Enter') $body.$password2.focus(); })
                $body.$password2.addEventListener('keyup',function(ev){ if(ev.key=='Enter') go(); })
            },
            buttons : [
                {
                    title : 'Set Password',
                    onclick : go
                }
            ]
        })

    }

    username.addEventListener('keyup',function(ev){
        if(ev.key=='Enter') password.focus();
    })

    password.addEventListener('keyup',function(ev){
        if(ev.key=='Enter') login.onclick();
    })

    if( window.__setpassword ) return setpassword();

    username.focus();

})