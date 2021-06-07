$(document).ready(function () {
    let list_song = {};
    let audio = document.getElementById("play_audio");
    get_playlist();

    audio.addEventListener('ended', function () {
        if ($('#replay').is(':checked')) {
            let cur_song = $('#song_list').val();
            play_audio(cur_song);
        } else {
            play_audio();
        }
    }, true);

    $('#play').click(function () {
        play_audio();
    });

    $('#playlist').change(function () {
        generate_song_list();
    });

    $('#song_list').click(function () {
        let value = $(this).val();
        play_audio(value);
    });

    $('#start').click(function () {
        let loop_time = ($('#loop_time').val() * 1000) + 5000;
        let loop = setInterval(function () {
            audio.pause();
            setTimeout(function () {
                audio.play();
            }, 5000);
        }, loop_time);

        $('#stop').click(function () {
            clearInterval(loop);
        });
    });

    function play_audio(index) {

        // random if not defined index
        if (typeof index == 'undefined') {
            let rand_num = Math.floor(Math.random() * Object.keys(list_song).length);
            index = Object.keys(list_song)[rand_num];
        }

        audio.src = list_song[index]['link'];
        audio.load();
        audio.play();
        document.title = list_song[index]['name'] + ' - ' + list_song[index]['artist'] + ' - ' + 'Feel the beat!!!';

        $('#file_name').empty();
        $('#file_name').append('Now playing: ' + list_song[index]['name'] + ' - ' + list_song[index]['artist']);
    }

    function get_playlist() {
        $.ajax({
            type: "GET",
            dataType: 'json',
            async: false,
            url: 'db.php',
            data: {
                playlist: true
            },
            success: function (result) {
                $('#playlist').append('<option value = "0">All</option>');
                for (key in result) {
                    if (result.hasOwnProperty(key)) {
                        $('#playlist').append('<option value = "' + result[key]['playlist_id'] + '">' + result[key]['name'] + '</option>');
                    }
                }
                generate_song_list();
            }
        });
    }

    function generate_song_list() {
        $('#song_list').empty();
        let current_playlist = $('#playlist').val();

        $.ajax({
            type: "GET",
            dataType: 'json',
            async: false,
            url: 'db.php',
            data: {
                playlist_detail: current_playlist
            },
            success: function (result) {
                list_song = {};

                for (key in result) {
                    if (result.hasOwnProperty(key)) {
                        list_song[result[key]['song_id']] = {
                            name: result[key]['name'],
                            artist: result[key]['artist'],
                            link: result[key]['link'],
                        };
                    }
                }

                let str = '';
                for (key in result) {
                    if (result.hasOwnProperty(key)) {
                        str += '<option value = "' + result[key]['song_id'] + '">' + result[key]['name'] + ' - ' + result[key]['artist'] + '</option>';
                    }
                }
                $('#song_list').append(str);
            }
        });
    }
});