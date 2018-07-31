function addViewsChart(chrtStngs, chkbxVl, chrtDataWeek, cnvs){
    var newVieFollDataset = {
        label: chkbxVl.val(),
        borderColor: rndColor(),
        backgroundColor: 'transparent',
        data: chrtDataWeek,
    };

    var tmp = chrtStngs.data.datasets;
    tmp[tmp.length] = newVieFollDataset;
    cnvs.update();
}

function removeViewsChart(chrtStngs, chkbxVl, cnvs){
    chrtStngs.data.datasets.forEach(function (currentValue, i) {
        if (chrtStngs.data.datasets[i].label == chkbxVl.val()) {
            chrtStngs.data.datasets.splice(i, 1);
            cnvs.update();
        }
    });

}

function getCheckedViewsChIDs() {
    var res = [];
    $.each($('.mutliSelect_followers input[type="checkbox"]:checked'), function (i) {
        // var id = parseInt($(this).attr("id").split("_")[1]);
        var id = $(this).attr("data-obj-id");
        res.push(id);
    });
    return res;
}

function rndColor() {
    return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
}

function ShowFirstViewChartChecbox(chkBx) {
    var title_vf = chkBx.val() + ",";
    var t_show = '<span title_vf="' + title_vf + '">' + title_vf + '</span>';
    $('.VFChart').append(t_show);
    $(".hida").hide();
}

function div(val, by){
    return (val - val % by) / by;
}

function getChartsViewsData(checkboxesID, dateStart, dateEnd){
    var ordID = checkboxesID;

    //на беке загнать данные в ассоциативный массив и перегнать его в json json_encode(); в таком виде:
    var resultVFChart = {
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
        url: "/Admin/ChartsStreamer/Views",
        type: "POST",
        data: {ordersId: ordID,  startDate: dateStart, endDate:  dateEnd},
        dataType: "json",
        async: false,
        success: function (data) {
            console.log(data);
            if(!data.error){
                //Labels for CHART
                resultVFChart.days.labels = data.chartData.days.labels.slice(0);

                //Values for CHART
                resultVFChart.days.channelsId = JSON.stringify(data.chartData.days.ordersId);
                resultVFChart.days.channelsId = JSON.parse(resultVFChart.days.channelsId);

            } else {
                console.log(data);
            }
        }, error: function (data) {
            console.log(data);
        }
    });
    console.log('Ready');
    // $(".loading-overlay").removeClass('hide');
    return resultVFChart;
}




function setViewsData(chrtStngs, dataArr, data, chrt){
    chrtStngs.Views.data.labels = data.days.labels;

    $.each(data.days.channelsId, function (index, value) {
        dataArr[index] =  value;
        removeViewsChart(chrtStngs.Views, $("div.mutliSelect_followers input[type='checkbox'][data-f-id='"+index+"']"), chrt);
        addViewsChart(chrtStngs.Views, $("div.mutliSelect_followers input[type='checkbox'][data-f-id='"+index+"']"), dataArr[index], chrt);
    });
}



function handleDateViewsChange(s_date, e_date, chS, chDD, chDW){
    setTimeout(function() {
        var checkedIDs = getCheckedViewsChIDs();
        var data = getChartsViewsData(checkedIDs, s_date, e_date);
        setViewsData(chS, chDD, data, window.myLineVF);
    }, 100);
}

$(function () {
    START_DATE_Views = -1;
    END_DATE_Views = -1;
    $('#date_range_followers').datepicker({
        range: 'period', // select period
        numberOfMonths: 2,
        maxDate: '0',
        firstDay: 1,
        dateFormat:"yy-mm-dd",
        // direction: "up",
        onSelect: function (dateText, inst, extensionRange) {
            // extensionRange
            $('#startDayFollowers').val(extensionRange.startDateText);
            $('#endDayFollowers').val(extensionRange.endDateText);


            START_DATE_Views = extensionRange.startDateText;

            if(extensionRange.startDateText !== extensionRange.endDateText) {
                END_DATE_Views = extensionRange.endDateText;
                handleDateViewsChange(START_DATE_Views, END_DATE_Views, chartsViewsSettings, chartsDataTimeDays, chartsDataTimeWeeks);
            }
        }

    });
    $('#date_range_followers').datepicker('setDate', ['-6d', '+6d']);
    // Datapicker value
    var extensionRange = $('#date_range_followers').datepicker('widget').data('datepickerExtensionRange');
    if (extensionRange.startDateText) $('#startDayFollowers').val(extensionRange.startDateText);
    if (extensionRange.endDateText) $('#endDayFollowers').val(extensionRange.endDateText);
    START_DATE_Views = extensionRange.startDateText;
    END_DATE_Views = extensionRange.endDateText;
// vars init
    var ctx = document.getElementById('stream-followers').getContext('2d');
    var Checbox_element_views = $('.mutliSelect_followers input[type="checkbox"]') ;
    var chartsDataTimeDays = {};
    var chartsDataTimeWeeks = {};
//Days chart

    var chartsViewsSettings = {};
    chartsViewsSettings.Views = {
        type: 'line',
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
                            return  value + ' amount';
                        }
                    }
                }]
            },
        },

    };


    var DaysVFChart = function (settings) {
        window.myLineVF = new Chart(ctx, settings);
    };


    // SELECT CHECKBOX IN DROPDOWN
    $('.mutliSelect_followers input[type="checkbox"]').on('click', function () {
        var title_vf = $(this).closest('.mutliSelect_followers').find('input[type="checkbox"]').val(),
            title_vf = $(this).val() + ",";
        if ($(this).is(':checked')) {
            var t_show = '<span title_vf="' + title_vf + '">' + title_vf + '</span>';
            $('.VFChart').append(t_show);
            $(".hida").hide();
        } else {
            $('span[title_vf="' + title_vf + '"]').remove();
            var ret = $(".hida");
            $('.followersMenu dt a').append(ret);
        }
    });




    //DRAWING
    DaysVFChart(chartsViewsSettings.Views);
    ctx.clearRect(0, 0, 800, 400);

    Checbox_element_views[0].checked = true;
    if (Checbox_element_views[0].checked){
        ShowFirstViewChartChecbox(Checbox_element_views);
        // handleDateViewsChange(START_DATE_Views, END_DATE_Views, chartsViewsSettings, chartsDataTimeDays, chartsDataTimeWeeks);
    }

    //Действие  после изменения чекбокса
    $('.mutliSelect_followers input[type="checkbox"]').change(function () {
        var t = $(this);
        if(t[0].checked){
            var checkedInputID = t.attr("id");
            if(typeof chartsDataTimeDays[checkedInputID] === "undefined" && typeof chartsDataTimeWeeks[checkedInputID] === "undefined"){
                handleDateViewsChange(START_DATE_Views, END_DATE_Views, chartsViewsSettings, chartsDataTimeDays, chartsDataTimeWeeks);
            }

            addViewsChart(chartsViewsSettings.Views, t, chartsDataTimeDays[checkedInputID], window.myLineVF);
        } else {
            removeViewsChart(chartsViewsSettings.Views, t, window.myLineVF);
        }
    });
    $("#view-folowers-chart").click(function(){
        handleDateViewsChange(START_DATE_Views, END_DATE_Views, chartsViewsSettings, chartsDataTimeDays, chartsDataTimeWeeks);
    });
});




