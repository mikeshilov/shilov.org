<?php
require("db.php");
$url = 'https://shilov.org/dicstat/';
$who_id = $_GET['who_id'] ?? NULL;
$from_date = $_GET['from'] ?? date ("Y-m-d");;
$to_date = $_GET['to'] ?? date ("Y-m-d", mktime(0, 0, 0, date("m")  , date("d")+1, date("Y")));

function zero2nbsp($val): string
{
    return $val == 0 ? '&nbsp;' : $val;
}

function zero2empty($val): string
{
    return $val == 0 ? '' : $val;
}

function array2html ($arr): string
{
    $lines =[];
    foreach ($arr as $name => $value) {
        if (!is_string($value) && !is_numeric($value))
            $value = print_r ($value, true);
        $lines[] = "<div><pre><strong>$name&nbsp;=&nbsp;</strong>$value</pre></div>";
    }
    return join( '', $lines);
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
        .container {
            margin-top: 10px;
        }

        .click-cursor {
            cursor: pointer;
        }

        tr.highlight-on-hover:hover {
            background-color: #f0f0f0;
        }

        .done-text:after {
            content: " Done!";
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
                $no_output = ($what === "app.location");
                if ($what === 'table.rows.scroll') {
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
                        <td><?= $event['e_params'] ? array2html(json_decode($event['e_params'], true)) : '&nbsp;' ?></td>
                    </tr>
                    <?php
                }
            }
            ?>
            </tbody>
        </table>
        <?php
    } else {
    $name2ids = get_name2ids($from_date, $to_date);
    $id = $name2ids[array_key_first($name2ids)];
    $info = get_info($id);
    $menu2icon = ['open' => 'bi-folder2-open', 'save.open' => 'bi-save', 'save.done' => 'bi-save-fill', 'paste' => 'bi-clipboard', 'presets' => 'bi-bookmarks', 'support' => 'bi-telephone-fill'];
    $csvLines = ['Name,Date,Duration,Preset,Vis Changes,Vis Settings,Zoom,Col Selects,Menu,Errors'];
    //print "<code><pre>";
    //print_r ($info);
    //print "</pre></code>";
    ?>
    <button id="copy-clipboard-btn" type="button" class="btn btn-primary btn-sm" onclick="copyToClipboard();">Copy to
        clipboard
    </button>
    <a href="<?= "$url?from=2022-11-29&to=2022-12-07" ?>" class="btn btn-info btn-sm">
        with guiding
    </a>
    <a href="<?= "$url?from=2022-12-08&to=2022-12-14" ?>" class="btn btn-info btn-sm">
        without guiding
    </a>
    <table class="table">
        <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Date</th>
            <th scope="col">Duration</th>
            <th scope="col">Preset</th>
            <th scope="col">Vis Changes</th>
            <th scope="col">Vis Settings</th>
            <th scope="col">Zooms</th>
            <th scope="col">Col Selects</th>
            <th scope="col">Menu</th>
            <th scope="col">Errors</th>
        </tr>
        </thead>
        <tbody>
        <?php
        $blackList = ['B95E','AF53','743A','102A','F622','56F9','62DC','5E38','F7AD','5A8A','94C0','4AF9','C99F','1C46','7244','359F','0A02','6DBD','7D59','28E3','794B','30F0','D87A','A87D','C2A0','3394','7103','62F1','0582','A5A5','2047','3A50','9DF4','4547','EBF3','BB2F','07E0','DB72','3094','F871','CEDE','BC0B','4360','6992','6A6D','420C','B154','533D','409C','E02B','7B8D','6043','640E','9563','6E17','FCE8','9F07','50D5','287E','A460','5C24','FFEA','609C','BE13','E67D','C9E8','B967','16A7','C56D','B30B','B5A6','9AAF','9B19','FB15','4C6C','A0B1','F2F5','722D','BBE6','2FE6','C3BC','EC4D','C73B','BB78','977A','F745','13CE','01B4','9A64','B67B','7CCE','BE2F','8949','90B2','1C0D','1C31','DFD9','6C16','171C','2D81','094F','2668','49FE','7DAE','97C1','893E','8E00','41CA','BE9C','1D8F','1472','1B9E','1663','132B','100A','D479','6C44','DCD5','7278','768B','4D6D','18A6','8977','86FD','9FBF','439F','0EE1','5C5B','E7D3','4B88','CA3E','1786','AD42','C0E4','AA08','0AEA','8118','13E9','52B3','A834','AEEA','F8BC','D614','5F85','F040','2C96','2FBE','385A','E2DA','6A2C','8B72','032B','0F71','25E5','FBF9','CE3A','5C1E','3944','9B7C','4753','3295','A8E3','21C8','F0ED','33B9','1F54','7C68','3EE4','6169','06E9','CBCC','F434','8F17','0D84','089A','9825','8FD8','2361','EFB5','6F66','4980','4100','E881','8E08','B2EA','15A0','2FBC','B731','19F8','F189','F5FF','975F','432C','25DA','5369','2C39','09AB','E577','966C','455F','93A3','87FF','F818','E8D4','7772','A1C4','0573','792C','71C7','3C9A','F31F','68CE','1735','E5CA','02E4','CE7B','D806','060E'];
        foreach ($name2ids as $name => $id) {

            // ignore empty
            if (in_array($name, $blackList)) continue;

            $info = get_info($id);

            // only those who zoomed
            if ($info['col_selects'] == 0) continue;

            $start_info = $info['app_start'];

            if (strpos($start_info['userAgent'], 'YandexBot') !== false
                || strpos($start_info['userAgent'], 'YaDirectFetcher') !== false)
                continue;

            $date = $info['started'];
            $long_date = date('Y-m-d', $date);
            $short_date = date('M-d', $date);
            $duration = gmdate("H:i:s", $info['ended'] - $info['started']);
            $menus = $info['sidebar_menu'] ? get_menus($id) : [];
            $csvLines []= "$name,$long_date,$duration,{$info['preset']},"
                .zero2empty($info['vis_changes']).","
                .zero2empty($info['vis_settings']).","
                .zero2empty($info['chart_zoom']).","
                .zero2empty($info['col_selects']).","
                .zero2empty(count($menus)).","
                .zero2empty($info['app_errors']);

            /*
            if ($info['vis_changes'] == 0 &&
                $info['vis_settings'] == 0 &&
                $info['chart_zoom'] == 0 &&
                $info['col_selects'] == 0 &&
                count($menus) == 0)
                continue;
            */
            ?>
            <tr class="highlight-on-hover click-cursor"
                onclick="window.location='<?= "$url?who_id=$id" ?>'">
                <th scope="row"><?= $name ?></th>
                <td><?= $short_date ?></td>
                <td><?= $duration ?></td>
                <td><?= $info['preset'] ?></td>
                <td><?= zero2nbsp($info['vis_changes']) ?></td>
                <td><?= zero2nbsp($info['vis_settings']) ?></td>
                <td><?= zero2nbsp($info['chart_zoom']) ?></td>
                <td><?= zero2nbsp($info['col_selects']) ?></td>
                <td><?php foreach ($menus as $menu) print('<i class="bi ' . (array_key_exists($menu, $menu2icon) ? $menu2icon[$menu] : "bi-question") . '"></i>') ?></td>
                <td><?= zero2nbsp($info['app_errors']) ?></td>
            </tr>
            <?php
        }
        ?>
        <h4><?="[$from_date ; $to_date) Total: ".(count($csvLines) - 1)?></h4>
        <pre id="csv-text" style="display: none"><?= join("\n", $csvLines) ?></pre> <?php
        }
        ?>
        </tbody>
    </table>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3"
        crossorigin="anonymous"></script>
<script>
    function copyToClipboard() {
        const text = document.getElementById("csv-text").innerText;
        const copyBtn = document.getElementById('copy-clipboard-btn');

        navigator.clipboard.writeText(text).then(function () {
            copyBtn.classList.add("done-text");
            setTimeout(() => copyBtn.classList.remove("done-text"), 1000);
        }, function (err) {
            alert('Could not copy: ' + err);
        });
    }
</script>
</body>
</html>
