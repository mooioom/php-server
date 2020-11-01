<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <script src="__shared/utils/modular.2.js"></script>
    <script>

        document.addEventListener('DOMContentLoaded',function(){

            Modular.base = '__shared/dashboard';

            window.dashboard = document.body.modular({
                module : 'dashboard',
                data : { base : '__admin/' }
            })

        })

    </script>
</head>
<body></body>
</html>