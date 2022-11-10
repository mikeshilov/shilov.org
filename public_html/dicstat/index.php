<?php
require("db.php");
$name2ids = get_name2ids();
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DATAISCLEAR Stats</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
</head>
<body>
<div class="container">
    <?php
        $id = $name2ids[array_key_first($name2ids)];
        $info = get_info ($id);
        print "<code><pre>";
        print_r ($info);
        print "</pre></code>";

    ?>
    <table class="table">
        <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Date</th>
            <th scope="col">Duration</th>
            <th scope="col">Preset</th>
            <th scope="col">Vis Changes</th>
            <th scope="col">Col Selects</th>
        </tr>
        </thead>
        <tbody>
        <?php
        foreach ($name2ids as $name => $id) {
            $info = get_info ($id);
            $o_date = date('M-d',$info['started']);
            $minutes = floor(($info['ended'] - $info['started']) / 60);
            $seconds = ($info['ended'] - $info['started']) % 60;
            $o_duration = ($minutes<10 ? "0" : "").$minutes.":".($seconds<10 ? "0" : "").$seconds;
            ?>
            <tr>
                <th scope="row"><?= $name ?></th>
                <td><?= $o_date ?></td>
                <td><?= $o_duration ?></td>
                <td><?= $info['preset'] ?></td>
                <td><?= $info['vis_changes'] ?></td>
                <td><?= $info['col_selects'] ?></td>
            </tr>
            <?php
        }
        ?>
        </tbody>
    </table>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3"
        crossorigin="anonymous"></script>
</body>
</html>
