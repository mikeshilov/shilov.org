<!doctype html>

<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--<meta http-equiv="refresh" content="1" >-->
    <title>HEATER</title>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
        google.charts.load('current', {'packages':['corechart']});

        /*
        function drawChart(rows) {
            const raw = [['Время', 'Температура']].concat(rows);
            //console.log (raw.slice(0,10));
            const data = google.visualization.arrayToDataTable([raw]);

            const options = {
                title: 'Котёл',
                legend: { position: 'bottom' }
            };

            const chart = new google.visualization.LineChart(document.getElementById('temp_chart'));

            chart.draw(data, options);
        }
        */

        google.charts.load('current', {'packages': ['line', 'corechart']});

        function drawChart(values) {
            const chartDiv = document.getElementById('chart_div');
            const data = new google.visualization.DataTable();
            data.addColumn('datetime', 'Время');
            data.addColumn('number', "Температура");

            const rows = [];
            //[[new Date(2014, 0), -.5], [new Date(2014, 1), .4], [new Date(2014, 2), .5]];
            values.forEach((row) => rows.push([new Date(Date.parse(row[0])), row[1]]));

            console.log (rows.slice(0,10));
            data.addRows(rows);

            const materialOptions = {
                chart: {title: 'Температура воды в системе'},
                width: 900,
                height: 500,
                series: { // Gives each series an axis name that matches the Y-axis below.
                    0: {axis: 'Температура'}
                },
                axes: { // Adds labels to each axis; they don't have to match the axis names.
                    y: { Temps: {label: 'Температура'} }
                }
            };

            const materialChart = new google.charts.Line(chartDiv);
            materialChart.draw(data, materialOptions);
        }
    </script>
</head>

<body style="background-color: #150a49; color: white; padding: 10px; font-family:monospace">
<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <img id="pic" src="" alt='pic'/>
    <h1 id="temp"></h1>
    <h3 id="msg"></h3>
    <pre>
        <?php
        //require ('db.php');
        //print_r (get_last_temp());
        ?>
    </pre>
    <div id="chart_div" style="width: 900px; height: 500px"></div>
</div>
<script>
    let interval_id, requesting=false, xmlHttp;

    function request()
    {
        if (!requesting && !document.hidden) {
            requesting = true;
            xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    try {
                        const resp = JSON.parse(xmlHttp.responseText);
                        document.getElementById("msg").innerText = resp['msg'];
                        document.getElementById("temp").innerText = resp['temp'];
                        document.getElementById("pic").src = 'data:image/png;base64,' + resp['pic'];
                        //drawChart(resp['rows']);
                        requesting = false;
                    } catch {
                        console.log("API response error: " + xmlHttp.responseText)
                    }

                }
            }
            xmlHttp.open("GET", 'api.php?action=get', true);
            xmlHttp.send(null);
        }
    }

    window.onload = function() {
        request();
        interval_id = setInterval(request, 500);
    }

    window.onbeforeunload = function (){
        clearInterval(interval_id);
        if (xmlHttp) {
            xmlHttp.abort();
        }
    };
</script>
</body>
</html>
