<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Register</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="__shared/utils/css/form.css">
    <script src="__shared/utils/form.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded',function(){

            var form = new Form({

                data : {
                    firstname : 'Eldad Eliyahu',
                    lastname  : 'Levi',
                    email     : 'eldad_levi@hotmail.com',
                    password  : '!234Qwer',
                    retype    : '!234Qwer'
                },

                inputs : {
                    'firstname' : {description : 'First Name', width : '50', validation:'!isAlphabet(firstname)?"Lettrers / spaces":false'},
                    'lastname'  : {description : 'Last Name', width : '50', validation:'!isAlphabet(lastname)?"Lettrers / spaces":false'},
                    'email'     : {description : 'Email', validation:'!isEmail(email)?"Valid Email Address":false'},
                    'password'  : {description : 'Password', type:'password', validation : 'passwordStrength(password)'},
                    'retype'    : {description : 'Retype Password', type:'password', validation : 'password!=retype?"Passwords do not match":false'},
                    // 'credit1' : {description:'Credit Card', width : '25'},
                    // 'credit2' : {description:'.', width : '25'},
                    // 'credit3' : {description:'.', width : '25'},
                    // 'credit4' : {description:'.', width : '25'},
                    // 'credit' : {
                    //     hidden : true,
                    //     value : 'credit1+credit2+credit3+credit4',
                    //     validation : '!isCreditCard(credit)?true:false'
                    // }
                },

                submit : {
                    title : 'Register',
                    full : false,
                    onclick : function( data, validation_errors ){

                        if( validation_errors ) return;

                        call('dashboard/register',function( r ){

                            console.log(r);

                        },data)

                    }
                }

            });

            document.querySelector('.form').appendChild(form.$element);
        })
    </script>
</head>
<body>
    <div class="form">

    </div>
</body>
</html>