window.fileloader = function( oncontent ){
    "use strict";
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = function(e){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = function(readerEvent){
            var content = readerEvent.target.result;
            oncontent && oncontent(content,file);
        }
    }
    input.click();
}