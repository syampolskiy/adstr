function addTimeChart(chrtStngs, chkbxVl, chrtDataWeek, cnvs){
    var newTimeDataset = {
        label: chkbxVl.val(),
        borderColor: 'transparent',
        backgroundColor:rndColor() ,
        data: chrtDataWeek,
    };

    var tmp = chrtStngs.data.datasets;
    tmp[tmp.length] = newTimeDataset;
    cnvs.update();
}

function removeTimeChart(chrtStngs, chkbxVl, cnvs){
    chrtStngs.data.datasets.forEach(function (currentValue, i) {
        if (chrtStngs.data.datasets[i].label == chkbxVl.val()) {
            chrtStngs.data.datasets.splice(i, 1);
            cnvs.update();
        }
    });

}

function getCheckedTimeChIDs() {
    var res = [];
    $.each($('.timeChart_select input[type="checkbox"]:checked'), function (i) {
        var id = parseInt($(this).attr("id").split("_")[1]);
        res.push(id);
    });
    return res;
}

function rndColor() {
    return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
}

function ShowFirstTimeChartChecbox(chkBx) {
    var title_t = chkBx.val() + ",";
    var t_show = '<span title_t="' + title_t + '">' + title_t + '</span>';
    $('.timeChart').append(t_show);
    $(".hida").hide();
}

function div(val, by){
    return (val - val % by) / by;
}

function getChartsTimeData(checkboxesID, dateStart, dateEnd){
    var colors = ['#D36969','#8F9BFF','#B76298','#56A555','#DEAC17','#FD72FE','#7278FE','#fe98e5','#2C1395','#DA70D6','#E9967A','#64078D','#00E62C','#E60091','#007069','#700400'];
    var ordID = checkboxesID.join(",");

    //на беке загнать данные в ассоциативный массив и перегнать его в json json_encode(); в таком виде:
    var resultTimeChart = {
        days: {
            labels: [],
            channelsId: {}
        },
        weeks: {
            labels: [],
            channelsId: {}
        }
    };
    // $(".loading-overlay").addClass('hide');
    console.log('Loading');
    $.ajax({
        url: "/Admin/ChartsStreamer/IncomeTest",
        type: "POST",
        data: {orderId: ordID,  startDate: dateStart, endDate:  dateEnd},
        dataType: "json",
        async: false,
        success: function (data) {
            if(!data.error){
                //Labels for CHART
                resultTimeChart.days.labels = data.chartData.days.labels.slice(0);
                var daysLabels = resultTimeChart.days.labels;
                var daysLabelsLen = daysLabels.length;

                for(i = 0; i < Math.ceil(daysLabelsLen/7); ++i){
                    var ind = i*7;
                    resultTimeChart.weeks.labels[i] = daysLabels[ind];
                }

                //Values for CHART
                resultTimeChart.days.channelsId = JSON.stringify(data.chartData.days.channelsId);
                resultTimeChart.days.channelsId = JSON.parse(resultTimeChart.days.channelsId);
            } else {
                console.log(data);
            }
        }, error: function (data) {
            console.log(data);
        }
    });
    // $(".loading-overlay").removeClass('hide');
    console.log('Ready');
    return resultTimeChart;
}

function setTimeDaysData(chrtStngs, dataArr, data, chrt){
    chrtStngs.Days.data.labels = data.days.labels;

    $.each(data.days.channelsId, function (index, value) {
        dataArr[index] =  value;
        removeTimeChart(chrtStngs.Days, $("#channel_"+index), chrt);
        addTimeChart(chrtStngs.Days, $("#channel_"+index), dataArr[index], chrt);

    });
}

function setTimeWeeksData(chrtStngs, dataArr, data, chrt){

    $.each(data.days.channelsId, function (index, value) {
        var tmp = [],
            i = 0,
            k = 0;

        for(i = 0; i < Math.ceil(value.length/7); ++i){
            tmp[i] = 0;
        }

        for (i = 0, k = 0; i < value.length; ++i, k=div(i,7)){
            tmp[k] += value[i];
        }

        dataArr[index] = tmp;


        chrtStngs.Weeks.data.labels = data.weeks.labels;


        removeTimeChart(chrtStngs.Weeks, $("#channel_"+index), chrt);
        addTimeChart(chrtStngs.Weeks, $("#channel_"+index), dataArr[index], chrt);
    });
}


function dateforWeeks(){
    var tmp = [];
    $.each($("#date_range_time td.selected"), function (i) {
        tmp.push($(this).children("a").text()+"."+$(this).attr("data-month")+"."+$(this).attr("data-year"));
    });
    return tmp;
}

function handleDateTimeChange(s_date, e_date, chS, chDD, chDW){
    setTimeout(function() {
        var checkedIDs = getCheckedTimeChIDs();
        var data = getChartsTimeData(checkedIDs, s_date, e_date);

        setTimeDaysData(chS, chDD, data, window.myLineTime);
        setTimeWeeksData(chS, chDW, data, window.myLineTime2);

    }, 100);
}

$(function () {
    START_DATE_TIME = -1;
    END_DATE_TIME = -1;
    $('#date_range_time').datepicker({
        range: 'period', // select period
        numberOfMonths: 2,
        maxDate: '0',
        firstDay: 1,
        dateFormat:"yy-mm-dd",
        // direction: "up",
        onSelect: function (dateText, inst, extensionRange) {
            // extensionRange
            $('#startDayTime').val(extensionRange.startDateText);
            $('#endDayTime').val(extensionRange.endDateText);


            START_DATE_TIME = extensionRange.startDateText;

            if(extensionRange.startDateText !== extensionRange.endDateText) {
                END_DATE_TIME = extensionRange.endDateText;
                handleDateTimeChange(START_DATE_TIME, END_DATE_TIME, chartsTimeSettings, chartsDataTimeDays, chartsDataTimeWeeks);
            }
        }

    });
    $('#date_range_time').datepicker('setDate', ['-1w', '+1w']);
    // Datapicker value
    var extensionRange = $('#date_range_time').datepicker('widget').data('datepickerExtensionRange');
    if (extensionRange.startDateText) $('#startDayTime').val(extensionRange.startDateText);
    if (extensionRange.endDateText) $('#endDayTime').val(extensionRange.endDateText);
    START_DATE_TIME = extensionRange.startDateText;
    END_DATE_TIME = extensionRange.endDateText;
// vars init
    var ctx = document.getElementById('stream-time').getContext('2d');
    var ctx2 = document.getElementById('stream-time2').getContext('2d');
    var Checbox_element_time = $('.timeChart_select input[type="checkbox"]') ;
    var chartsDataTimeDays = {};
    var chartsDataTimeWeeks = {};
//Days chart

    var chartsTimeSettings = {};
    chartsTimeSettings.Days = {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            legend: {
                position: 'right',
                fontSize: 20,
                fullWidth: false,
                boxWidth: 10,
                usePointStyle: true
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) {
                            return  value + ' min';
                        }
                    }
                }]
            },
        },

    };
    chartsTimeSettings.Weeks = {
        type: 'bar',
        data: {
            labels: [],

        },
        options: {
            legend: {
                position: 'right',
                fontSize: 20,

            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) {
                            return  value + ' min';
                        }
                    }
                }]
            },
        }
    };

    var DaysTimeChart = function (settings) {
        window.myLineTime = new Chart(ctx, settings);
    };
    var WeeksTimeChart = function (settings) {
        window.myLineTime2 = new Chart(ctx2, settings);
    };

    // SELECT CHECKBOX IN DROPDOWN
    $('.timeChart_select input[type="checkbox"]').on('click', function () {
        var title_t = $(this).closest('.timeChart_select').find('input[type="checkbox"]').val(),
            title_t = $(this).val() + ",";
        if ($(this).is(':checked')) {
            var t_show = '<span title_t="' + title_t + '">' + title_t + '</span>';
            $('.timeChart').append(t_show);
            $(".hida").hide();
        } else {
            $('span[title_t="' + title_t + '"]').remove();
            var ret = $(".hida");
            $('.timeChartIdsMenu dt a').append(ret);
        }
    });



    // Toggle chars DAYS || WEEKS
    $("input.time_chart").change(function () {
        $("#stream-time, #stream-time2").toggleClass("show");
    });

    //DRAWING
    WeeksTimeChart(chartsTimeSettings.Weeks);
    DaysTimeChart(chartsTimeSettings.Days);
    ctx.clearRect(0, 0, 800, 400);
    ctx2.clearRect(0, 0, 800, 400);

    Checbox_element_time[0].checked = true;
    if (Checbox_element_time[0].checked){
        ShowFirstTimeChartChecbox(Checbox_element_time);
        handleDateTimeChange(START_DATE_TIME, END_DATE_TIME, chartsTimeSettings, chartsDataTimeDays, chartsDataTimeWeeks);
    }

    //Действие  после изменения чекбокса
    $('.timeChart_select input[type="checkbox"]').change(function () {
        var t = $(this);
        if(t[0].checked){
            var checkedInputID = t.attr("id");
            if(typeof chartsDataTimeDays[checkedInputID] === "undefined" && typeof chartsDataTimeWeeks[checkedInputID] === "undefined"){
                handleDateTimeChange(START_DATE_TIME, END_DATE_TIME, chartsTimeSettings, chartsDataTimeDays, chartsDataTimeWeeks);
            }

            addTimeChart(chartsTimeSettings.Days, t, chartsDataTimeDays[checkedInputID], window.myLineTime);
            addTimeChart(chartsTimeSettings.Weeks, t, chartsDataTimeWeeks[checkedInputID], window.myLineTime2);
        } else {
            removeTimeChart(chartsTimeSettings.Days, t, window.myLineTime);
            removeTimeChart(chartsTimeSettings.Weeks, t, window.myLineTime2);
        }
    });
});




