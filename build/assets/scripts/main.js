(function($) {

    $('.navbar-toggle').click(function(){
        $(this).toggleClass('open');
    });

    // Use Vimeo
    $('.w-bg-video').vide('https://player.vimeo.com/external/158148793.hd.mp4?s=8e8741dbee251d5c35a759718d4b0976fbf38b6f&profile_id=119&oauth2_token_id=57447761', {
        loop: true,
        muted: true,
        position: "50% 50%"
    });


    // Custom Scroll
    $('.scroll-infos').mCustomScrollbar({
        mouseWheelPixels: 150
    });

    $('.scroll-itens').mCustomScrollbar({
        axis:"x"
    });

    // Menu List Carros
    $(document).on('click', '.no-inner-click', function (e) {
        e.stopPropagation();
    });

    $('.carros-menu-list').mCustomScrollbar({
        mouseWheelPixels: 150
    });

    // $('.scroll-itens').mCustomScrollbar({
    //
    // });

    // Adiconando Classe Open ao Panel Heading
    $colpseItem = $('.w-telefones .panel-collapse');

    $colpseItem.on('show.bs.collapse', function () {
        $(this).siblings('.panel-heading').addClass('open');
    });
    $colpseItem.on('hide.bs.collapse', function () {
        $(this).siblings('.panel-heading').removeClass('open');
    });

    // Slider Carros Relacionados
    $('.slide-carros').owlCarousel({
        items: 5,
        nav: true,
        dots: true,
        navText: [ '', '' ],

        responsive : {
            // breakpoint from 0 up
            0 : {
                items: 2,
                nav: false
            },
            // breakpoint from 480 up
            480 : {
                items: 3,
                nav: false
            },
            // breakpoint from 768 up
            768 : {
                items: 5,
                nav: true,
                loop: false
            }
        }

    });

    // Mask Telefone
    var maskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    telOptions = {
        onKeyPress: function(val, e, field, options) {
            field.mask(maskBehavior.apply({}, arguments), options);
        }
    };

    $('.mask_phone').mask(maskBehavior, telOptions);

    $('.mask_money').mask('#.##0,00', {reverse: true});
    // Custom Form iCheck
    $('input').iCheck({
        checkboxClass: 'icheckbox_custom',
        radioClass: 'iradio_custom',
        increaseArea: '20%' // optional
    });

})(jQuery); // Fully reference jQuery after this point.