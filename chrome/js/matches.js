'use strict';


$('#btn-upload-file').change(function(){
    let file = this.files[0];
    if(file!=undefined) {
        let filereader = new FileReader();
        filereader.onload = function() {
            let jsonText = filereader.result;
            let json = JSON.parse(jsonText);
            console.log(json);
            _displayImages(json);
        }

        filereader.onerror = function() {
            alert('Unable to read file. Try again');
        }

        filereader.readAsText(file);
    }
});

function _displayImages(json) {
    $('#img-src-img').attr('src', json.srcImgData);
    let matchImgsDiv = $('#div-matching-images');
    matchImgsDiv.empty();

    let otherImgsDiv = $('#div-other-images');
    otherImgsDiv.empty();

    for(var imginfo of json.matchImgs) {
        var imglink = document.createElement('a');
        imglink.className='floated_img';
        imglink.href=imginfo.profileLink;
        var imgsrc = document.createElement('img');
        imgsrc.src = imginfo.imgSrc;
        imglink.appendChild(imgsrc);
        matchImgsDiv.append(imglink);
    }

    for(var imginfo of json.otherImgs) {
        var imglink = document.createElement('a');
        imglink.className='floated_img';
        imglink.href=imginfo.profileLink;
        var imgsrc = document.createElement('img');
        imgsrc.src = imginfo.imgSrc;
        imglink.appendChild(imgsrc);
        otherImgsDiv.append(imglink);
    }
}