/**
 * base.js
 */

var jsScroll = {
    bottom : false,

    isEmpty : function(value) {
        return ((value == undefined) || (value == null) || (value == '') || (value == 'undefined') || (value == 'null'));
    },

    fetchNextPage : function(){
        var url    = $('#results').attr('data-url');
        var page   = $('#results').attr('data-page');
        var limit  = $('#results').attr('data-limit');
        var sort   = $('#results').attr('data-sort');
        var filter = $('#results').attr('data-filter');

        jsScroll.bottom = false;

        page = parseInt(page) + 1;

        $('#results').attr('data-page', page);

        url = url + '?page=' + page + '&limit=' + limit;

        if ((sort != null) && (sort != undefined) && (sort != '')) {
            url = url + '&sort=' + sort;
        }
        if ((filter != null) && (filter != undefined) && (filter != '')) {
            url = url + '&filter[]=' + filter;
        }

        $.getJSON(url, function (data) {
            if ((data.results != undefined) && (data.results.length > 0)) {
                var nextRows = '';
                var start    = $('#results > tbody > tr').length + 1;
                for (var i = 0; i < data.results.length; i++) {
                    nextRows = nextRows + '<tr><td>' + (start + i) + '</td><td>' + data.results[i].id + '</td><td>' +
                        ((!jsScroll.isEmpty(data.results[i].username)) ? data.results[i].username : '') + '</td><td>' +
                        ((!jsScroll.isEmpty(data.results[i].first_name)) ? data.results[i].first_name : '') + '</td><td>' +
                        ((!jsScroll.isEmpty(data.results[i].last_name)) ? data.results[i].last_name : '') + '</td><td>' +
                        ((!jsScroll.isEmpty(data.results[i].email)) ? data.results[i].email : '') + '</td></tr>';
                }

                $('#results > tbody').append(nextRows);
                $('#loading').css('background-image', 'none');
            }
        });
    },

    fetchSearch : function() {
        if (($('#search_for').val() != '') && ($('#search_for').val() != undefined) && ($('#search_for').val() != null)) {
            var url      = $('#results').attr('data-url');
            var urlCount = $('#results').attr('data-url-count');

            $.getJSON(urlCount + '?filter[]=' + $('#search_by').val() + '%20LIKE%20' + $('#search_for').val() + '%25', function (data) {
                if (data.result_count != undefined) {
                    $('#result-count')[0].innerHTML = data.result_count;
                }
            });

            $.getJSON(url + '?limit=' + $('#results').attr('data-limit') + '&filter[]=' + $('#search_by').val() + '%20LIKE%20' + $('#search_for').val() + '%25', function (data) {
                if ((data.results != undefined) && (data.results.length > 0)) {
                    $('#results > tbody').remove();
                    var tbody = '<tbody>';
                    var start = 1;
                    for (var i = 0; i < data.results.length; i++) {
                        tbody = tbody + '<tr><td>' + (start + i) + '</td><td>' + data.results[i].id + '</td><td>' +
                            ((!jsScroll.isEmpty(data.results[i].username)) ? data.results[i].username : '') + '</td><td>' +
                            ((!jsScroll.isEmpty(data.results[i].first_name)) ? data.results[i].first_name : '') + '</td><td>' +
                            ((!jsScroll.isEmpty(data.results[i].last_name)) ? data.results[i].last_name : '') + '</td><td>' +
                            ((!jsScroll.isEmpty(data.results[i].email)) ? data.results[i].email : '') + '</td></tr>';
                    }
                    tbody = tbody + '</tbody>';


                    $('#results').append(tbody);

                    var thLinks = $('#results > thead > tr > th > a');
                    var filter  = $('#search_by').val() + '%20LIKE%20' + $('#search_for').val() + '%25';

                    for (var j = 0; j < thLinks.length; j++) {
                        var href = $(thLinks[j]).attr('href')
                        if (href.indexOf('&filter') != -1) {
                            href = href.substring(0, href.indexOf('&filter'));
                        }
                        href = href + '&filter[]=' + filter;
                        $(thLinks[j]).attr('href', href);
                    }

                    $('#results').attr('data-filter', filter);
                    $('#results').attr('data-page', 1);
                }
            });
        }
    }
};

$(document).ready(function(){
    // On window scroll
    $(window).scroll(function() {
        if (($(window).height() + $(window).scrollTop()) == $(document).height()) {
            if (parseInt($('#result-count')[0].innerHTML) > $('#results > tbody > tr').length) {
                $('#loading').css('background-image', 'url(/assets/img/loading.gif)');
                jsScroll.fetchNextPage();
            }
            jsScroll.bottom = true;
        } else {
            jsScroll.bottom = false;
        }
    });

    // On search text field key up
    $('#search_for').keyup(jsScroll.fetchSearch);
    $('#search_by').change(jsScroll.fetchSearch);
});