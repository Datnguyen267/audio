$(document).ready(function () {
    let list = [];
    let audio = document.getElementById("play_audio");
    get_playlist();

    audio.addEventListener('ended', function () {
        if ($('#replay').is(':checked')) {
            let cur_song = $('#file_name').text().replace('Now playing: ', '');
            play_audio(cur_song);
        } else {
            play_audio();
        }
    }, true);

    $('#play').click(function () {
        play_audio();
        generate_song_list();
    });

    $('#playlist').change(function () {
        generate_song_list();
    });

    $('#song_list').click(function () {
        let value = $(this).val();
        play_audio(value);
    });

    $('#start').click(function () {
        let loop_time = $('#loop_time').val() * 1000;
        let loop = setInterval(function () {
            audio.pause();
            setTimeout(function () {
                audio.play();
            }, 2000);
        }, loop_time);

        $('#stop').click(function () {
            clearInterval(loop);
        });
    });

    function play_audio(index) {
        let playlist = $('#playlist').val();
        let src = list[playlist];
        let array_key = [];
        if (typeof index == 'undefined') {
            let rand_num = Math.floor(Math.random() * Object.keys(src).length);
            for (const key in src) {
                if (src.hasOwnProperty(key)) {
                    array_key.push(key);
                }
            }
            index = array_key[rand_num];
        }

        audio.src = src[index];
        audio.load();
        audio.play();
        document.title = 'Feel the beat!!!' + ' - ' + index;

        $('#file_name').empty();
        $('#file_name').append('Now playing: ' + index);
    }

    function get_playlist() {
        $.ajax({
            url: "data.json",
            success: function (result) {
                list = result;
                for (key in list) {
                    if (list.hasOwnProperty(key)) {
                        $('#playlist').append('<option id = "' + key + '" >' + key + '</option>');
                    }
                }
                generate_song_list();
            }
        });
    }

    function generate_song_list() {
        $('#song_list').empty();
        let current_playlist = $('#playlist').val();

        for (key in list[current_playlist]) {
            if (list[current_playlist].hasOwnProperty(key)) {
                let str = '<option value = "' + key + '">' + key + '</option>';
                $('#song_list').append(str);
            }
        }
    }
});