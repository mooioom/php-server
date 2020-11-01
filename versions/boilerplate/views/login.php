<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>User Login</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="__shared/utils/css/fa.css">
    <link rel="stylesheet" href="__shared/utils/css/popup.css">
    <script src="js/login.js"></script>
    <script src="__shared/utils/popup.js"></script>
    <script src="__shared/utils/dom.js"></script>
</head>
<body>
    <table class="layout">
        <tr>
            <td class="login-holder">
                <div class="login">
                    <div class="logo padding">
                        User Login
                    </div>
                    <div class="main padding">
                        <table style="margin-bottom:10px">
                            <tr>
                                <td class="icon">
                                    <i class="icon-user" />
                                </td>
                                <td class="input">
                                    <input type="text" id="username" placeholder="Username / Email">
                                </td>
                            </tr>
                        </table>
                        <table>
                            <tr>
                                <td class="icon">
                                <i class="icon-key" />
                                </td>
                                <td class="input">
                                    <input type="password" id="password" placeholder="Password">
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="links padding">
                        <div class="button left" id="forgotpassword">Forgot Password?</div>
                        <div class="clear"></div>
                    </div>
                    <div class="status padding hide"></div>
                    <div class="buttons">
                        <div class="button" id="login">Login</div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
    <div class="ornament"><i class="icon-user"></i></div>
    <?php 
        if( isset($_GET['auth']) && isset($_GET['type']) ){

            $token = $_GET['auth'];
            $type  = $_GET['type'];

            if( $type == 1 && DOS::api('dashboard/check_token',['token'=>$token,'type'=>$type])){ // forgot password

                ?>
                <script>
                    __setpassword = '<?=$token ?>';
                </script>
                <?php

            }

            if( $type == 2 ){ // auto login

                if(DOS::api('dashboard/check_token',['token'=>$token,'type'=>$type])){

                    if( DOS::api('dashboard/login_token',['token'=>$token])){

                        ?>
                        <script>
                            window.location = 'admin';
                        </script>
                        <?php

                    }

                };

            }

        }
    ?>
</body>
</html>