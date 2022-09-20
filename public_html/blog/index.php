<?php

include 'Parsedown.php';

function readMD ($filename, $noHtml = false) {
    $Parsedown = new Parsedown();
    $rawContent = file_get_contents($filename);
    preg_match('/^\s*---\s*(?<header>.+?)---\s*(?<text>.*)/s', $rawContent, $matches, PREG_OFFSET_CAPTURE, 0);
    $text = $matches['text'][0];
    $headers = [];
    foreach (explode("\n", $matches['header'][0]) as $line) {
        $colpos = strpos($line, ':');
        if ($colpos !== false)
            $headers[substr($line, 0, $colpos)] = trim(substr($line, $colpos + 1), "' ");
    }
    return ["title" => $headers["title"], "html" => $noHtml ? '' : $Parsedown->text($text)];
}

$path = "https://".$_SERVER['HTTP_HOST'].str_replace('index.php', '', $_SERVER['SCRIPT_NAME']);
$articles = [];
foreach (scandir("posts") as $fileName) {
    $c = strlen($fileName);
    if ($fileName[$c-3]=='.' && $fileName[$c-2]=='m' && $fileName[$c-1]=='d') {
        $content = readMD ("posts/$fileName", true);
        $articles[] = ['title' => $content['title'], 'url' => $path.substr ($fileName, 0, $c-3)];
    }
}
$slug = isset($_GET['slug']) && trim($_GET['slug']) ? $_GET['slug'] : 'sql-server-data-analysis-python-jupyterlab';
$content = readMD ("posts/$slug.md");
$title = $content['title'];
$html = $content['html'];
$html = str_replace('<a href', '<a target="_blank" href', $html);
$html = preg_replace('/src="([^"]+)"/', 'src="'.$path.'assets/$1"', $html);
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Mike's notes on Data Analysis">
    <meta name="author" content="Mike Shilov">
    <title>Data Analysis Notes</title>
    <link href="bootstrap.min.css" rel="stylesheet">
    <link href="styles.css" rel="stylesheet">

    <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
    <link rel="manifest" href="favicon/site.webmanifest">
    <link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#5bbad5">
    <link rel="shortcut icon" href="favicon/favicon.ico">

    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-config" content="favicon/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">

    <!-- Yandex.Metrika counter -->
    <script type="text/javascript" >
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(90325414, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true
        });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/90325414" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter --></head>
<body>

<main class="container">
    <div class="row g-5">
        <div class="col-lg-9">
            <article class="blog-post">
                <h2 class="blog-post-title my-4"><?=$title?></h2>
                <?=$html?>
            </article>
        </div>

        <div class="col-lg-3">
            <div class="position-sticky" style="top: 2rem;">
                <div class="p-4 mb-3 bg-light rounded">
                    <ol class="list-unstyled mb-0">
                        <?
                        foreach ($articles as $a)
                            print '<li class="mb-4"><a href="'.$a['url'].'">'.$a['title'].'</a></li>';
                        ?>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</main>

</body>
</html>
