<!doctype html>

<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>HEATER</title>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
        google.charts.load('current', {'packages': ['line', 'corechart']});
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
    <div id="chart_div" style="width: 100%; height: 500px; padding: 10px; background-color: white; border-radius: 10px;"></div>
</div>
<script>
    let intCur, intChart, requestingCurrentData=false, requestingChartData=false;

    function drawChart(data) {
        const chartDiv = document.getElementById('chart_div');
        const dataTable = new google.visualization.DataTable();
        dataTable.addColumn('datetime', 'Время');
        dataTable.addColumn('number', "");

        const rows = [];
        data.forEach(row => rows.push([new Date(Date.parse(row[0])), row[1]]));
        dataTable.addRows(rows);

        new google.charts.Line(chartDiv).draw(dataTable, {
            chart: {title: 'Температура воды в системе'},
            width: chartDiv.offsetWidth - 20,
            height: 500,
            series: { // Gives each series an axis name that matches the Y-axis below.
                0: {axis: ''}
            },
            axes: { // Adds labels to each axis; they don't have to match the axis names.
                y: { Temps: {label: ''} }
            }
        });
    }

    function requestCurrentData()
    {
        if (!requestingCurrentData && !document.hidden) {
            requestingCurrentData = true;
            const reqCur = new XMLHttpRequest();
            reqCur.onreadystatechange = function () {
                if (reqCur.readyState === 4 && reqCur.status === 200) {
                    try {
                        const resp = JSON.parse(reqCur.responseText);
                        document.getElementById("msg").innerText = resp['msg'];
                        document.getElementById("temp").innerText = resp['temp'];
                        document.getElementById("pic").src = 'data:image/png;base64,' + resp['pic'];
                    } catch {
                        console.log("API response error: " + reqCur.responseText)
                    }
                    requestingCurrentData = false;
                }
            }
            reqCur.open("GET", 'api.php?action=get', true);
            reqCur.send();
        }
    }

    function requestChartData(hours)
    {
        if (!requestingChartData && !document.hidden) {
            requestingChartData = true;
            const reqChart = new XMLHttpRequest();
            reqChart.onreadystatechange = function () {
                if (reqChart.readyState === 4 && reqChart.status === 200) {
                    try {
                        const resp = JSON.parse(reqChart.responseText);
                        if (!resp['error']) {
                            drawChart(resp['rows']);
                        }
                        else {
                            alert (resp['error']);
                        }
                    } catch {
                        console.log("API response error: " + reqChart.responseText)
                    }
                    requestingChartData = false;
                }
            }
            reqChart.open("GET", 'api.php?action=last&hours='+hours, true);
            reqChart.send();
        }
    }

    function refreshChart () {
        requestChartData(1);
    }

    window.onload = function() {
        requestCurrentData();
        refreshChart();
        intCur = setInterval(requestCurrentData, 500);
        intChart = setInterval(refreshChart, 10000);
    }

    window.onbeforeunload = function (){
        clearInterval(intCur);
        clearInterval(intChart);
    };

    window.onresize = function (){
        refreshChart();
    };

    //window.onkeydown = function (event) {
    //    console.log (event.keyCode.toString(16));
    //};

</script>
</body>
</html>
