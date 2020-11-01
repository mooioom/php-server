document.addEventListener('DOMContentLoaded',function(){

    login.onclick = function(){

        call('__admin/login',function( status ){

            if(status) location.reload();

        },{
            username : username.value,
            password : password.value
        })

    }

    document.addEventListener('keyup',function(ev){
        if(ev.key=='Enter') login.onclick();
    })

})