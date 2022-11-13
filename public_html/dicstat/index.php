<?php
require("db.php");
$who_id = $_GET['who_id'] ?? NULL;

function hideZero($val)
{
    return $val == 0 ? '&nbsp;' : $val;
}

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DATAISCLEAR Stats</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
    <style>
        .click-cursor {
            cursor: pointer;
        }

        tr.highlight-on-hover:hover {
            background-color: #f0f0f0;
        }
    </style>
</head>
<body>
<div class="container">
    <?php
    if ($who_id) {
        ?>
        <nav aria-label="breadcrumb" style="--bs-breadcrumb-divider: '>';">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="https://shilov.org/dicstat/">Objects</a></li>
                <li class="breadcrumb-item active" aria-current="page"><?= $who_id ?></li>
            </ol>
        </nav>
        <table class="table">
            <thead>
            <tr>
                <th scope="col">When</th>
                <th scope="col">What</th>
                <th scope="col">Params</th>
            </tr>
            </thead>
            <tbody>
            <?php
            $events = get_events($who_id);
            $table_scrolls = 0;
            $table_scroll_when = '';
            foreach ($events as $event) {
                $what = $event['e_what'];
                $when = $event['e_when'];
                $no_output = false;
                if ($what == 'table.rows.scroll') {
                    if ($table_scrolls == 0) {
                        $table_scroll_when = $when;
                    }
                    $table_scrolls += 1;
                    $no_output = true;
                } else if ($table_scrolls) {
                    ?>
                    <tr class="highlight-on-hover">
                        <td><?= $table_scroll_when ?></td>
                        <td><?= "table.rows.scroll * $table_scrolls" ?></td>
                        <td>&nbsp;</td>
                    </tr>
                    <?php
                    $table_scrolls = 0;
                }

                if (!$no_output) {
                    ?>
                    <tr class="highlight-on-hover">
                        <td><?= $event['e_when'] ?></td>
                        <td><?= $what ?></td>
                        <td><?= $event['e_params'] ?? '' ?></td>
                    </tr>
                    <?php
                }
            }
            ?>
            </tbody>
        </table>
        <?php
    } else {
    $name2ids = get_name2ids();
    $id = $name2ids[array_key_first($name2ids)];
    $info = get_info($id);
    $menu2icon = ['open' => 'bi-folder2-open', 'save.open' => 'bi-save', 'save.done' => 'bi-save-fill', 'paste' => 'bi-clipboard', 'presets' => 'bi-bookmarks'];
    //print "<code><pre>";
    //print_r ($info);
    //print "</pre></code>";
    ?>
    <nav aria-label="breadcrumb" style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Objects</li>
        </ol>
    </nav>
    <table class="table">
        <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Date</th>
            <th scope="col">Duration</th>
            <th scope="col">Preset</th>
            <th scope="col">Vis Changes</th>
            <th scope="col">Vis Settings</th>
            <th scope="col">Col Selects</th>
            <th scope="col">Menu</th>
            <th scope="col">Errors</th>
        </tr>
        </thead>
        <tbody>
        <?php
        foreach ($name2ids as $name => $id) {
            $info = get_info($id);
            $o_date = date('M-d', $info['started']);
            $minutes = floor(($info['ended'] - $info['started']) / 60);
            $seconds = ($info['ended'] - $info['started']) % 60;
            $o_duration = ($minutes < 10 ? "0" : "") . $minutes . ":" . ($seconds < 10 ? "0" : "") . $seconds;
            $menus = $info['sidebar_menu'] ? get_menus($id) : [];
            ?>
            <tr class="highlight-on-hover click-cursor"
                onclick="window.location='https://shilov.org/dicstat/?who_id=<?= $id ?>'">
                <th scope="row"><?= $name ?></th>
                <td><?= $o_date ?></td>
                <td><?= $o_duration ?></td>
                <td><?= $info['preset'] ?></td>
                <td><?= hideZero($info['vis_changes']) ?></td>
                <td><?= hideZero($info['vis_settings']) ?></td>
                <td><?= hideZero($info['col_selects']) ?></td>
                <td><?php foreach ($menus as $menu) print('<i class="bi '.$menu2icon[$menu].'"></i>') ?></td>
                <td><?= hideZero($info['app_errors']) ?></td>
            </tr>
            <?php
        }
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
