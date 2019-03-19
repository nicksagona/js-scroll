/**
 * base.js
 */

var jsScroll = {
    bottom : false,

    isEmpty : function(value) {
        return ((value == undefined) || (value == null) || (value == '') || (value == 'undefined') || (value == 'null'));
    },

    fetchNextPage : function(){
        var page   = $('#users').attr('data-page');
        var limit  = $('#users').attr('data-limit');
        var sort   = $('#users').attr('data-sort');
        var filter = $('#users').attr('data-filter');

        jsScroll.bottom = false;

        page = parseInt(page) + 1;

        $('#users').attr('data-page', page);

        var url = '/users?page=' + page + '&limit=' + limit;

        if ((sort != null) && (sort != undefined) && (sort != '')) {
            url = url + '&sort=' + sort;
        }
        if ((filter != null) && (filter != undefined) && (filter != '')) {
            url = url + '&filter[]=' + filter;
        }

        $.getJSON(url, function (data) {
            if ((data.users != undefined) && (data.users.length > 0)) {
                var nextRows = '';
                var start    = $('#users > tbody > tr').length + 1;
                for (var i = 0; i < data.users.length; i++) {
                    nextRows = nextRows + '<tr><td>' + (start + i) + '</td><td>' + data.users[i].id + '</td><td>' +
                        ((!jsScroll.isEmpty(data.users[i].username)) ? data.users[i].username : '') + '</td><td>' +
                        ((!jsScroll.isEmpty(data.users[i].first_name)) ? data.users[i].first_name : '') + '</td><td>' +
                        ((!jsScroll.isEmpty(data.users[i].last_name)) ? data.users[i].last_name : '') + '</td><td>' +
                        ((!jsScroll.isEmpty(data.users[i].email)) ? data.users[i].email : '') + '</td></tr>';
                }

                $('#users > tbody').append(nextRows);
                $('#loading').css('background-image', 'none');
            }
        });
    }
};

$(document).ready(function(){
    // On window scroll
    $(window).scroll(function() {
        if (($(window).height() + $(window).scrollTop()) == $(document).height()) {
            if (parseInt($('#user-count')[0].innerHTML) > $('#users > tbody > tr').length) {
                $('#loading').css('background-image', 'url(/assets/img/loading.gif)');
                jsScroll.fetchNextPage();
            }
            jsScroll.bottom = true;
        } else {
            jsScroll.bottom = false;
        }
    });

    // On search text field key up
    $('#username').keyup(function(){
        if (($('#username').val() != '') && ($('#username').val() != undefined) && ($('#username').val() != null)) {
            $.getJSON('/users/count?filter[]=' + $('#search_by').val() + '%20LIKE%20' + $('#username').val() + '%25', function (data) {
                if (data.user_count != undefined) {
                    $('#user-count')[0].innerHTML = data.user_count;
                }
            });

            $.getJSON('/users?limit=' + $('#users').attr('data-limit') + '&filter[]=' + $('#search_by').val() + '%20LIKE%20' + $('#username').val() + '%25', function (data) {
                if ((data.users != undefined) && (data.users.length > 0)) {
                    $('#users > tbody').remove();
                    var tbody = '<tbody>';
                    var start = 1;
                    for (var i = 0; i < data.users.length; i++) {
                        tbody = tbody + '<tr><td>' + (start + i) + '</td><td>' + data.users[i].id + '</td><td>' +
                            ((!jsScroll.isEmpty(data.users[i].username)) ? data.users[i].username : '') + '</td><td>' +
                            ((!jsScroll.isEmpty(data.users[i].first_name)) ? data.users[i].first_name : '') + '</td><td>' +
                            ((!jsScroll.isEmpty(data.users[i].last_name)) ? data.users[i].last_name : '') + '</td><td>' +
                            ((!jsScroll.isEmpty(data.users[i].email)) ? data.users[i].email : '') + '</td></tr>';
                    }
                    tbody = tbody + '</tbody>';


                    $('#users').append(tbody);

                    var thLinks = $('#users > thead > tr > th > a');
                    var filter  = $('#search_by').val() + '%20LIKE%20' + $('#username').val() + '%25';

                    for (var j = 0; j < thLinks.length; j++) {
                        var href = $(thLinks[j]).attr('href')
                        if (href.indexOf('&filter') != -1) {
                            href = href.substring(0, href.indexOf('&filter'));
                        }
                        href = href + '&filter[]=' + filter;
                        $(thLinks[j]).attr('href', href);
                    }

                    $('#users').attr('data-filter', filter);
                    $('#users').attr('data-page', 1);
                }
            });
        }
    });
});