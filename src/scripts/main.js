var brath = brath || {};
brath.app = (function(){
    'use strict';
    var init;

    init = function(){
        console.log('init');
        if (figure)
            figure.init();
        if (floater)
            floater.init();
    };

    return {
        init : init
    }
})(document, window);

(function(doc) {
    function getScript(url, success) {
        var script = doc.createElement('script');
        script.src = url;
        var head = doc.getElementsByTagName('head')[0],
            done = false;
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;
                success();
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            }
        };
        head.appendChild(script);
    }

    getScript('//code.jquery.com/jquery-2.1.4.min.js', function() {
        getScript('/js/plugins.js', function() {

        });
        brath.app.init();
    });
    getScript('//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js', function(){});
})(document);


