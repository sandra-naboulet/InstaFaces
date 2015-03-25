/*jshint curly: true, eqeqeq: true, latedef: true, undef: true, quotmark: single,
  unused: true, browser: true, jquery: true */
/*global Rainbow:true */
(function() {
    'use strict';

    // constants
    var API_URL = 'http://api.faceplusplus.com/';
    var API_KEY = '0df565d6e2a56d30a100686779ada46f';
    var API_SECRET = 'hO1Ox6df2oym7QKBb562_VRywxwHBj6d';

    // error messages
    var messages = {
        URL_ERROR:   'Invalid URL',
        LOAD_ERROR:  'Failed to Load',
        LOADING:     'Loading...',
        NO_FACE:     'No face detected',
        NO_CAMERA:   'No camera available'
    };

    // vendor prefix
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia || navigator.msGetUserMedia;


    function makeDetector(el, options) {
        var container = $(el);
        var photolist = container.find('.photolist');

        // add <img> to photolist
        var images = [];
        for (var i = 0, len = options.imgs.length; i < len; i++) {
            var img = document.createElement('img');
            img.src = options.imgs[i];
            img.width = img.height = 80;
            images.push(img);
        }
        photolist.append(images);

        // paddles
        var sliding = false;
        container.find('.left-paddle').click(function() {
            if (sliding === false) {
                sliding = true;
                photolist.css({ left: '-80px' })
                    .prepend(photolist.children('img:last-child'))
                    .animate({ left: 0 }, 200, 'linear', function() {
                        sliding = false;
                    });
            }
        });
        container.find('.right-paddle').click(function() {
            if (sliding === false) {
                sliding = true;
                photolist.animate({ left: '-80px' }, 200, 'linear', function() {
                    photolist.css({ left: 0 })
                        .append(photolist.children('img:first-child'));
                    sliding = false;
                });
            }
        });

        var canvas = container.find('.canvas').get(0);
        var ctx = canvas.getContext('2d');

        var width = canvas.width,
            height = canvas.height;

        var currentImg = new Image();
        var totalImageCount = 0;
        var facesContainer = container.find('.faces'); // container for face boxes 

        function clearCanvas() {
            ctx.fillStyle = '#EEE';
            ctx.fillRect(0, 0, width, height);
        }

        /**
         * Hide button in input bar if feature not available
         */
        function hideInputButton(selector) {
            var btn = container.find(selector);
            var url = container.find('.url-field');
            url.width(btn.outerWidth(true) + url.width());
            btn.hide();
        }

        /**
         * Start loading message
         */
        function startLoading() {
            facesContainer.addClass('loading');
        }

        /**
         * Remove loading message
         */
        function stopLoading() {
            facesContainer.removeClass('loading invalid');
        }

        var restUrl = container.find('.rest-url');

        /**
         * Show error messages or rest url
         */
        function showStatus(text) {
            restUrl.text(text);
        }

        /**
         * Draw face boxes
         *
         * imageInfo:
         * {
         *     width: <image width>
         *     height: <image height>
         *     offsetX: <image offset from canvas>
         *     offsetY: <image offset from canvas>
         *  }
         */
        function drawFaces(imageInfo, faces) {
            startLoading();

            if (faces.length === 0) {
                showStatus(messages.NO_FACE);
            } else {
                for (var i = faces.length - 1; i >= 0; i--) {
                    var face = faces[i];

                    // change box color based on gender
                    var rgbColor,
                        rgbaColor;

                    if (face.attribute.gender.value === 'Male') {
                        rgbColor = '#12BDDC';
                        rgbaColor = 'rgba(18,189,220,0.8)';
                    } else {
                        rgbColor = '#C537D8';
                        rgbaColor = 'rgba(197,55,216,0.8)';
                    }

                    var pointType = ['eye_left', 'eye_right', 'mouth_left', 'mouth_right'];

                    // draw facial pointType
                    ctx.fillStyle = rgbColor;
                    for (var j = pointType.length - 1; j >= 0; j--) {
                        ctx.beginPath();
                        ctx.arc(imageInfo.offsetX + face[pointType[j]].x * imageInfo.width * 0.01,
                                imageInfo.offsetY + face[pointType[j]].y * imageInfo.height * 0.01,
                                face.width * 0.01 * 6, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // create box for highlighting face region
                    $('<div/>').css({
                                position: 'absolute',
                                top: imageInfo.offsetY + (face.center.y - face.height / 2) * 0.01 * imageInfo.height - 5,
                                left: imageInfo.offsetX + (face.center.x - face.width / 2) * 0.01 * imageInfo.width - 5,
                                width: face.width * imageInfo.width * 0.01,
                                height: face.height * imageInfo.height * 0.01,
                                border: '5px solid ' + rgbColor,
                                borderColor: rgbaColor,
                                borderRadius: '10px'
                            }).
                            qtip({
                                content: '<table>' +
                                             '<tr><td>width</td><td>'        + (face.width * 0.01).toFixed(2) + '</td></tr>' +
                                             '<tr><td>height</td><td>'       + (face.height * 0.01).toFixed(2) + '</td></tr>' +
                                             '<tr><td>center</td><td>('      + (face.center.x      * 0.01).toFixed(2) + ', ' + (face.center.y      * 0.01).toFixed(2) + ')</td></tr>' +
                                             '<tr><td>eye_left</td><td>('    + (face.eye_left.x    * 0.01).toFixed(2) + ', ' + (face.eye_left.y    * 0.01).toFixed(2) + ')</td></tr>' +
                                             '<tr><td>eye_right</td><td>('   + (face.eye_right.x   * 0.01).toFixed(2) + ', ' + (face.eye_right.y   * 0.01).toFixed(2) + ')</td></tr>' +
                                             '<tr><td>mouth_left</td><td>('  + (face.mouth_left.x  * 0.01).toFixed(2) + ', ' + (face.mouth_left.y  * 0.01).toFixed(2) + ')</td></tr>' +
                                             '<tr><td>mouth_right</td><td>(' + (face.mouth_right.x * 0.01).toFixed(2) + ', ' + (face.mouth_right.y * 0.01).toFixed(2) + ')</td></tr>' +
                                             '<tr><td>race</td><td>'         + face.attribute.race.value + ' (' + face.attribute.race.confidence.toFixed(2) + '%)</td></tr>' +
                                             '<tr><td>age</td><td>'          + face.attribute.age.value + ' (&#177;' + face.attribute.age.range + ')</td></tr>' +
                                             '<tr><td>gender</td><td>'       + face.attribute.gender.value + ' (' + face.attribute.gender.confidence.toFixed(2) + '%)</td></tr>' +
                                         '</table>',
                                style: {
                                    classes: 'detector-tooltip ui-tooltip-light ui-tooltip-tipify'
                                },
                                position: {
                                    my: 'bottom center',
                                    at: 'top center'
                                }
                            }).
                            appendTo(facesContainer);
                }
            }
            stopLoading();
        }

        /**
         * Start face detection.
         *
         * src <string>: image url or dataURI
         * dataURI <boolean>: whether src is a dataURI
         */
        function detect(src, dataURI) {
            if (src === currentImg.src) { // don't reload if detecting same image
                return;
            }

            var currentImageCount = ++totalImageCount;

            startLoading();
            clearCanvas();
            // remove all face boxes
            facesContainer.children().remove();

            currentImg.onload = function() {
                var scale = Math.min(width / currentImg.width, height / currentImg.height, 1.0);
                var imageInfo = {
                    width: currentImg.width * scale,
                    height: currentImg.height * scale,
                    offsetX: (width - currentImg.width * scale) / 2,
                    offsetY: (height - currentImg.height * scale) / 2
                };
                ctx.drawImage(
                    currentImg,
                    imageInfo.offsetX,
                    imageInfo.offsetY,
                    imageInfo.width,
                    imageInfo.height
                );

                faceppDetect({
                    img: currentImg.src,
                    type: (dataURI ? 'dataURI' : 'url'),
                    success: function(faces) {
                        if (currentImageCount === totalImageCount) {
                            // display "REST URL"
                            var url = API_URL + 'detection/detect?api_key=' + API_KEY + '&api_secret=' + API_SECRET;
                            if (!dataURI) {
                                url += '&url=' + encodeURIComponent(currentImg.src);
                            }
                            showStatus(url);

                            var json = JSON.stringify(faces, null, '  ');
                            try {
                                // highlight json for "Response JSON"
                                Rainbow.color(json, 'javascript', function(html) {
                                    container.find('.result').html(html);
                                });
                            } catch (err) {
                                container.find('.result').text(json);
                            }

                            drawFaces(imageInfo, faces.face);
                        }
                    },
                    error: function() {
                        if (currentImageCount === totalImageCount) {
                            clearCanvas();
                            stopLoading();
                            showStatus(messages.LOAD_ERROR);
                        }
                    }
                });
            };
            currentImg.onerror = function() {
                clearCanvas();
                stopLoading();
                facesContainer.addClass('invalid');
                container.find('.result').html('');
                showStatus(messages.URL_ERROR);
            };
            currentImg.src = src;
        }

        // ==================== INPUT ======================

        // URL Input
        container.find('.url-field').
            focus(function() { $(this).select(); }).
            mouseup(function() { return false; });

        container.find('.url-form').on('submit', function() {
            detect($(this).children('.url-field').val());
            return false;
        });

        // Photolist input
        photolist.children('img').click(function() {
            var url = container.find('.url-field');
            url.val(this.src);
            detect(this.src);
        });

        // Webcam Input
        if (navigator.getUserMedia) {
            var webcam = container.find('.webcam');
            if (webcam) {
                webcam.click(function() {
                    $('.camera-modal').show();
                    navigator.getUserMedia({
                            video: true,
                            audio: false
                        },
                        function(localMediaStream) {
                            var video = $('.camera-modal video').get(0);
                            var cameraModal = container.find('.camera-modal');

                            var modalClose = function() {
                                $(video).hide();
                                localMediaStream.stop();
                                cameraModal.hide();
                                container.find('.capture').hide();
                                cameraModal.unbind('click');
                            };
                            cameraModal.click(modalClose);

                            video.src = window.URL.createObjectURL(localMediaStream);
                            video.onerror = function() {
                                localMediaStream.stop();
                                modalClose();
                            };

                            $([container.find('.capture').get(0), video]).
                                show().
                                unbind('click').
                                click(function() {
                                    startLoading();
                                    var scale = Math.min(width / video.videoWidth, height / video.videoHeight, 1);
                                    // draw video on to canvas
                                    var tmpCanvas = document.createElement('canvas');
                                    tmpCanvas.height = video.videoHeight * scale;
                                    tmpCanvas.width = video.videoWidth * scale;
                                    tmpCanvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth * scale, video.videoHeight * scale);

                                    detect(tmpCanvas.toDataURL('image/jpeg'), true);
                                    modalClose();
                                    return false;
                                });

                        },
                        function() {
                            $('.camera-modal').hide();
                            showStatus(messages.NO_CAMERA);
                            hideInputButton('.webcam');
                        }
                    );
                    return false;
                });
            }
        } else {
            hideInputButton('.webcam');
        }

        // Upload input
        if (window.FileReader) {
            container.find('.upload-file').change(function() {
                if (this.files.length > 0) {
                    startLoading();
                    var reader = new FileReader();
                    reader.onload = function() {
                        detect(reader.result, true);
                    };
                    reader.onerror = function() {
                        stopLoading();
                        facesContainer.addClass('invalid');
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });
        } else {
            hideInputButton('.upload-file-wrapper');
        }

        // initialize to first image in photlist
        clearCanvas();
        photolist.children('img:first-child').click();
    }


    // =========== utility functions ===========

    /**
     * Reference: http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
     */
    function dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    }

    /**
     * options:
     *     {
     *         img:     <string>   URL or Data-URI,
     *         type:    <string>   'url' or 'dataURI',
     *         success: <function> success callback,
     *         error:   <function> error callback
     *     }
     */
    function faceppDetect(options) {
        if ($.support.cors) {
            var xhr = new XMLHttpRequest();
            xhr.timeout = 10 * 1000;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        options.success(JSON.parse(xhr.responseText));
                    } else {
                        options.error();
                    }
                }
            };

            if (options.type === 'url') {
                xhr.open('GET', API_URL + 'detection/detect?api_key=' + API_KEY + '&api_secret=' + API_SECRET + '&url=' + encodeURIComponent(options.img), true);
                xhr.send();
            } else if (options.type === 'dataURI') {
                xhr.open('POST', API_URL + 'detection/detect?api_key=' + API_KEY + '&api_secret=' + API_SECRET, true);
                var fd = new FormData();
                fd.append('img', dataURItoBlob(options.img));
                xhr.send(fd);
            } else {
                options.error();
            }
        } else { // fallback to jsonp
            if (options.type === 'url') {
                $.ajax({
                    url: API_URL + 'detection/detect',
                    data: {
                        api_key: API_KEY,
                        api_secret: API_SECRET,
                        url: options.img
                    },
                    dataType: 'jsonp',
                    success: options.success,
                    error: options.error,
                    timeout: 10 * 1000
                });
            } else {
                options.error();
            }
        }
    }

    // onload function

    $(function() {
        makeDetector(document.getElementById('detector'), {
            imgs: [
                'http://faceplusplus.com/static/img/demo/1.jpg',
                'http://faceplusplus.com/static/img/demo/2.jpg',
                'http://faceplusplus.com/static/img/demo/3.jpg',
                'http://faceplusplus.com/static/img/demo/4.jpg',
                'http://faceplusplus.com/static/img/demo/5.jpg',
                'http://faceplusplus.com/static/img/demo/6.jpg',
                'http://faceplusplus.com/static/img/demo/7.jpg',
                'http://faceplusplus.com/static/img/demo/8.jpg',
                'http://faceplusplus.com/static/img/demo/9.jpg',
                'http://faceplusplus.com/static/img/demo/10.jpg',
                'http://faceplusplus.com/static/img/demo/11.jpg',
                'http://faceplusplus.com/static/img/demo/12.jpg',
                'http://faceplusplus.com/static/img/demo/13.jpg',
                'http://faceplusplus.com/static/img/demo/14.jpg',
                'http://faceplusplus.com/static/img/demo/15.jpg',
                'http://faceplusplus.com/static/img/demo/16.jpg',
                'http://faceplusplus.com/static/img/demo/17.jpg',
                'http://faceplusplus.com/static/img/demo/18.jpg',
                'http://faceplusplus.com/static/img/demo/19.jpg',
                'http://faceplusplus.com/static/img/demo/20.jpg',
                'http://faceplusplus.com/static/img/demo/21.jpg'
            ]
        });
    });

})();