/**
 * base.js
 */

$(document).ready(function(){
    $('#username').keyup(function(){
        if (($('#username').val() != '') && ($('#username').val() != undefined) && ($('#username').val() != null)) {
            $.getJSON('/users/count?filter[]=' + $('#search_by').val() + '%20LIKE%20' + $('#username').val() + '%25', function (data) {
                if (data.user_count != undefined) {
                    $('#user-count')[0].innerHTML = data.user_count;
                }
            });

            $.getJSON('/users?limit=' + $('#user-count').data('pagination') + '&filter[]=' + $('#search_by').val() + '%20LIKE%20' + $('#username').val() + '%25', function (data) {
                if ((data.users != undefined) && (data.users.length > 0)) {
                    $('#users > tbody').remove();
                    var tbody = '<tbody>';

                    for (var i = 0; i < data.users.length; i++) {
                        tbody = tbody + '<tr><td>' + data.users[i].id + '</td><td>' +
                            data.users[i].username + '</td><td>' +
                            data.users[i].first_name + '</td><td>' +
                            data.users[i].last_name + '</td><td>' +
                            data.users[i].email + '</td></tr>';
                    }
                    tbody = tbody + '</tbody>';
                    $('#users').append(tbody);

                    var thLinks = $('#users > thead > tr > th > a');
                    for (var j = 0; j < thLinks.length; j++) {
                        var href = $(thLinks[j]).attr('href')
                        if (href.indexOf('&filter') != -1) {
                            href = href.substring(0, href.indexOf('&filter'));
                        }
                        href = href + '&filter[]=' + $('#search_by').val() + '%20LIKE%20' + $('#username').val() + '%25';
                        $(thLinks[j]).attr('href', href);
                    }
                }
            });
        }
    });
});