$(document).ready(function() {

    $("a#test_source").click(function(e) {

        var self = $(this);
        self.addClass('disabled');
        var itemId = $('.item-functions').attr('id');
        self.children('.default-icon').hide();
        self.children('.loading-icon').show();
        $.post({
            url: "/admin/items/test_http",
            //type: 'post',
            data: {
                'itemId': itemId
            }
        }).done(function(response) {
            self.removeClass('disabled');
            self.children('.default-icon').show();
            self.children('.loading-icon').hide();
            if (response['status'] === 'ok') {
                $('#success_item_http').show();
                setTimeout(function() {
                    $("#success_item_http").fadeOut('fast');
                }, 10000);
            } else {
                $('#fail_item_http').show();
                setTimeout(function() {
                    $("#fail_item_http").fadeOut('fast');
                }, 10000);
            }
        });
        e.preventDefault();
    });


    $("a#test_links_list").click(function(e) {
        var self = $(this);
        self.addClass('disabled');

        var itemId = $('.item-functions').attr('id');

        self.children('.default-icon').hide();
        self.children('.loading-icon').show();
        $('.items_list_error').hide();

        $.post({
            url: "/admin/items/test_links",
            data: {
                'itemId': itemId
            }
        }).done(function(response) {

            self.removeClass('disabled');
            self.children('.default-icon').show();
            self.children('.loading-icon').hide();

            if (response['status'] === 'ok' && response['links'].length > 0) {
                $('#links_count').html(response['links'].length);
                response['links'].forEach(function(item, i, arr) {
                    $('ol#links_list').append('<li style="padding-bottom: 10px;">' +
                        '<a href="' + item + '" class="' + itemId + '" target="_blank">Ссылка на описание</a> ' +
                        '<a type="button" href="#" class="btn btn-primary btn-sm single_item_parse_button">Спарсить страницу</a></li>');
                });
                $('.items_list_parsed').show();

            } else {
                $('.items_list_error').show();
                setTimeout(function() {
                    $(".items_list_error").fadeOut('fast');
                }, 10000);
            }
        });
        e.preventDefault();
    });

    $('body').on('click', 'a.single_item_parse_button', function(e) {
        var self = $(this);
        var itemId = self.prev('a').attr('class');
        var itemLink = self.prev('a').attr('href');

        $.post({
            url: "/admin/items/test_item_parse",
            data: {
                'itemId': itemId,
                'itemLink': itemLink
            }
        }).done(function(response) {
            $('.panel-collapse.in').collapse('toggle');
            self.removeClass('disabled');
            self.children('.default-icon').show();
            self.children('.loading-icon').hide();

            if (response['status'] === 'ok' && response['item_json']) {

                //JSON.stringify(obj, undefined, 4);                
                $('.parsed_item_div').append('<div class="alert alert-success">' +
                    '<button type="button" class="close" data-dismiss="alert">×</button> Результат парсинга страницы' +
                    '<a href="' + itemLink + '" class="parsed_item_href" target="_black">Ссылка на Item</a>' +
                    '<pre class="+parsed_item_obj">' + JSON.stringify(response['item_json'], undefined, 4) + '</pre></div>');
            } else {
                $('.parsed_item_div').append('<div class="alert alert-danger">' +
                    '<button type="button" class="close" data-dismiss="alert">×</button> Результат парсинга страницы' +
                    '<a href="' + itemLink + '" class="parsed_item_href" target="_black"> Ссылка на Item</a>' +
                    '<pre class="+parsed_item_obj">Ну удалось получить объект</pre></div>');
            }
        });
        e.preventDefault();
    });

});
