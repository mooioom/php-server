document.addEventListener('DOMContentLoaded',function(){

    document.body.addEventListener('mousedown',function(ev){

        var TIME_MS = 200;

        var $clicktell = document.createElement('div');
        $clicktell.classList.add('clicktell');
        $clicktell.style.left = ev.x - 10;
        $clicktell.style.top = ev.y - 10;

        document.body.appendChild($clicktell);

        setTimeout(function(){
            $clicktell.classList.add('clicktell-expand');
            setTimeout(function(){
                document.body.removeChild($clicktell);
            },TIME_MS)
        },1)

    })

})