/**
 * js-scroll.js
 */

var jsScroll = {
    bottom : false,

    isEmpty : function(value) {
        return ((value == undefined) || (value == null) || (value == '') ||
            (value == 'undefined') || (value == 'null'));
    },

    fetchNextPage : function(){
        var url      = $('#results').attr('data-url');
        var page     = $('#results').attr('data-page');
        var limit    = $('#results').attr('data-limit');
        var sort     = $('#results').attr('data-sort');
        var filter   = $('#results').attr('data-filter');
        var numbered = $('#results').attr('data-numbered');

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
                var keys     = Object.keys(data.results[0]);

                for (var i = 0; i < data.results.length; i++) {
                    nextRows = nextRows + '<tr>';
                    if (numbered == 1) {
                        nextRows = nextRows + '<td>' + (start + i) + '</td>';
                    }
                    for (var j = 0; j < keys.length; j++) {
                        nextRows = nextRows + '<td>' + ((!jsScroll.isEmpty(data.results[i][keys[j]])) ?
                            data.results[i][keys[j]] : '') + '</td>';
                    }
                    nextRows = nextRows + '</tr>';
                }

                $('#results > tbody').append(nextRows);
                $('#loading').css('background-image', 'none');
            }
        });
    },

    fetchSearch : function() {
        if (($('#search_for').val() != '') && ($('#search_for').val() != undefined) && ($('#search_for').val() != null)) {
            var filterFields      = jsScroll.getQuery('filter_fields');
            var filterFieldsQuery = '';
            if (filterFields != undefined) {
                for (var i = 0; i < filterFields.length; i++) {
                    filterFieldsQuery = filterFieldsQuery + ((filterFieldsQuery != '') ? '&' : '') + 'filter_fields[]=' + filterFields[i];
                }
            }

            var url = $('#results').attr('data-url') + '?limit=' + $('#results').attr('data-limit') +
                '&filter[]=' + $('#search_by').val() + '%20LIKE%20' + $('#search_for').val() + '%25' + '&' + filterFieldsQuery;
            var exportUrl = $('#results').attr('data-url-export') + '?filter[]=' + $('#search_by').val() +
                '%20LIKE%20' + $('#search_for').val() + '%25' + '&' + filterFieldsQuery;

            $('#export-btn').attr('href', exportUrl);

            $.getJSON(url, function (data) {
                $('#results > tbody').remove();
                if (data.result_count != undefined) {
                    $('#result-count')[0].innerHTML = data.result_count;
                }
                if ((data.results != undefined) && (data.results.length > 0)) {
                    var tbody    = '<tbody>';
                    var start    = 1;
                    var keys     = Object.keys(data.results[0]);
                    var numbered = $('#results').attr('data-numbered');

                    for (var i = 0; i < data.results.length; i++) {
                        tbody = tbody + '<tr>';
                        if (numbered == 1) {
                            tbody = tbody + '<td>' + (start + i) + '</td>';
                        }
                        for (var j = 0; j < keys.length; j++) {
                            tbody = tbody + '<td>' + ((!jsScroll.isEmpty(data.results[i][keys[j]])) ?
                                data.results[i][keys[j]] : '') + '</td>';
                        }
                        tbody = tbody + '</tr>';
                    }

                    tbody = tbody + '</tbody>';

                    $('#results').append(tbody);

                    var thLinks = $('#results > thead > tr > th > a');
                    var filter  = $('#search_by').val() + '%20LIKE%20' + $('#search_for').val() + '%25';

                    for (var k = 0; k < thLinks.length; k++) {
                        var href = $(thLinks[k]).attr('href')
                        if (href.indexOf('&filter') != -1) {
                            href = href.substring(0, href.indexOf('&filter'));
                        }
                        href = href + '&filter[]=' + filter;
                        if (filterFieldsQuery != '') {
                            href = href + '&' + filterFieldsQuery;
                        }
                        $(thLinks[k]).attr('href', href);
                    }

                    $('#results').attr('data-filter', filter);
                    $('#results').attr('data-page', 1);
                } else {
                    $('#results').append(
                        '<tbody><tr><td colspan="' + $('#results > thead > tr > th').length + '"><p class="no-results">' +
                        $('#results').attr('data-no-results') + '</p></td></tr></tbody>'
                    );
                }
            });
        }
    },

    getQuery : function(key, u) {
        var vars = [];
        var url  = (u != null) ? u : location.href;

        if (url.indexOf('?') != -1) {
            var varString = url.substring(url.indexOf('?') + 1);
            if (varString.indexOf('#') != -1) {
                varString = varString.substring(0, varString.indexOf('#'));
            }

            var varsAry = varString.split('&');
            for (var i = 0; i < varsAry.length; i++) {
                var gV    = varsAry[i].split('=');
                var key   = decodeURIComponent(gV[0]);
                var value = decodeURIComponent(gV[1])

                if (key.indexOf('[') != -1) {
                    key = key.substring(0, key.indexOf('['));
                    if (vars[key] == undefined) {
                        vars[key] = [];
                    }
                }

                if ((vars[key] != undefined) && (vars[key].constructor == Array)) {
                    vars[key].push(value);
                } else {
                    vars[key] = value;
                }
            }
        }

        if ((key != undefined) && (key != null)) {
            return (vars[key] != undefined) ? vars[key] : undefined;
        } else {
            return vars;
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

    // On search field key up or change
    $('#search_for').keyup(jsScroll.fetchSearch);
    $('#search_by').change(jsScroll.fetchSearch);
});