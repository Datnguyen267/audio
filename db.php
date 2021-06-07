<?php
$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'audio';

// create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// check connection
if ($conn->connect_error) {
    exit('Connection failed: ' . $conn->connect_error);
}

// set charset
$conn->set_charset('utf8');

// get playlist
if (isset($_GET['playlist'])) {

    $sql = 'SELECT playlist_id, name FROM playlist WHERE is_disabled = 0';

    $result = $conn->query($sql);
    $res = $result->fetch_all(MYSQLI_ASSOC);

    $conn->close();
    echo json_encode($res);
}

// get playlist detail
if (isset($_GET['playlist_detail'])) {

    if (intval($_GET['playlist_detail']) === 0) { // get all songs
        $sql = 'SELECT song.song_id, song.name, song.artist, song.link
        FROM song
        WHERE song.is_disabled = 0 ';
        $sql .= ' ORDER BY song.name';
    } else { // get by play_list_id
        $sql = 'SELECT song.song_id, song.name, song.artist, song.link
        FROM playlist_detail
        JOIN song ON song.song_id = playlist_detail.song_id
        WHERE playlist_detail.is_disabled = 0 AND song.is_disabled = 0 AND playlist_detail.play_list_id = ' . $_GET['playlist_detail'];
        $sql .= ' ORDER BY song.name';
    }


    $result = $conn->query($sql);
    $res = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $res[] = [
                'song_id' => $row['song_id'],
                'name' => $row['name'],
                'artist' => $row['artist'],
                'link' => $row['link'],
            ];
        }
    }

    $conn->close();
    echo json_encode($res);
}