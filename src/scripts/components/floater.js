var floater = floater || (function(win, doc){
    var init, resizer, scroller;

    var form, header, head = 0, offset = 0, movement = 0, left = 0, footer, foot, bottom, diff = 0;

    resizer = function(){
        $(form).removeClass('float');
        foot = footer ? $(footer).offset().top : 0;
        bottom = $(form).innerHeight() + head;
        offset = $(form).offset().top;
        left = $(form).offset().left;
        width = $(form).innerWidth();
        form.setAttribute('data-offset', offset);
        form.setAttribute('data-left', left);
        form.setAttribute('data-width', width);
        $(form).css('width',width);
        console.log(foot);
        console.log(bottom);

        scroller();
    };
    scroller = function(){


        if ( bottom + $(doc).scrollTop()  > foot && $(win).innerWidth() > 1024 ){
            diff = $(doc).scrollTop()  - foot + bottom;
            $(form).css('top', -diff);
        }
        else if ($(doc).scrollTop() > offset - head && $(win).innerWidth() > 1024){
            movement = $(doc).scrollTop() - offset + head;
            if (!$(form).hasClass('float')){
                $(form).toggleClass('float');
            }
            $(form).css('top',head )
            $(form).css('left',left )
        }
        else {
           $(form).removeClass('float');
           $(form).attr("style","");
           $(form).css('width',width);
           //$(form).css('top',0 )
        }


    };
    init = function(){
        form = doc.querySelector('#floater') || false;
        header = doc.getElementById('header') || false;
        footer = doc.getElementById('footer') || false;

        head = header ? $(header).innerHeight() + 10 : 0;

        if (form){
            resizer();
            win.onresize = function(ev){
                resizer();
            }
            doc.onscroll = function(ev){
                scroller();
            }
        }
    };

    return {
        init:init
    }
})(window, document);