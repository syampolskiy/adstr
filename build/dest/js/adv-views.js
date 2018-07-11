function addChartViews(chrtStngs, chkbxVl, chrtDataWeek, cnvs){
    var newDataset = {
        label: chkbxVl.val(),
        borderColor: rndColor(),
        backgroundColor: 'transparent',
        data: chrtDataWeek,
    };

    var tmp = chrtStngs.data.datasets;
    tmp[tmp.length] = newDataset;
    cnvs.update();
}

function removeChartViews(chrtStngs, chkbxVl, cnvs){
    chrtStngs.data.datasets.forEach(function (currentValue, i) {
        if (chrtStngs.data.datasets[i].label == chkbxVl.val()) {
            chrtStngs.data.datasets.splice(i, 1);
            cnvs.update();
        }
    });

}

function getViewsCheckedIDs() {
    var res = [];
    $.each($('.views-select input[type="checkbox"]:checked'), function (i) {
        var id = parseInt($(this).attr("id").split("_")[1]);
        res.push(id);
    });
    return res;
}

function rndColor() {
    return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
}

function ShowFirstViewChecbox(chkBx) {
    var title_vie = chkBx.val() + ",";
    var html = '<span title_vie="' + title_vie + '">' + title_vie + '</span>';
    $('.view-sel').append(html);
    $(".hida").hide();
}

function div(val, by){
    return (val - val % by) / by;
}

function getViewChartsData(checkboxesID, dateStart, dateEnd){
    var ordID = checkboxesID.join(",");

    //на беке загнать данные в ассоциативный массив и перегнать его в json json_encode(); в таком виде:
    var resultViews = {
        days: {
            labels: [],
            channelsId: {}
        }
    };
    // $(".loading-overlay").addClass('hide');
    $.ajax({
        url: "/Admin/ChartsStreamer/IncomeTest",
        type: "POST",
        data: {orderId: ordID,  startDate: dateStart, endDate:  dateEnd},
        dataType: "json",
        async: false,
        success: function (data) {
            if(!data.error){
                //Labels for CHART
                resultViews.days.labels = data.chartData.days.labels.slice(0);

                //Values for CHART
                resultViews.days.channelsId = JSON.stringify(data.chartData.days.channelsId);
                resultViews.days.channelsId = JSON.parse(resultViews.days.channelsId);
            } else {
                console.log(data);
            }
        }, error: function (data) {
            console.log(data);
        }
    });
    // $(".loading-overlay").removeClass('hide');
    return resultViews;
}

function setViewsData(chrtStngs, dataArr, data, chrt){
    chrtStngs.Days.data.labels = data.days.labels;

    $.each(data.days.channelsId, function (index, value) {
        dataArr[index] =  value;
        removeChartViews(chrtStngs.Days, $("#channel_"+index), chrt);
        addChartViews(chrtStngs.Days, $("#channel_"+index), dataArr[index], chrt);
    });
}
function handleViewDateChange(s_date, e_date, chS, chDD, chDW){
    setTimeout(function() {
        var checkedIDs = getViewsCheckedIDs();
        var data = getViewChartsData(checkedIDs, s_date, e_date);

        setViewsData(chS, chDD, data, window.myViewLine);
    }, 100);
}

$(function () {
    START_DATE_VIEW = -1;
    END_DATE_VIEW = -1;
    $('#date_range_view').datepicker({
        range: 'period', // select period
        numberOfMonths: 2,
        maxDate: '0',
        firstDay: 1,
        dateFormat:"yy-mm-dd",
        // direction: "up",
        onSelect: function (dateText, inst, extensionRange) {
            // extensionRange
            $('#startDayView').val(extensionRange.startDateText);
            $('#endDayView').val(extensionRange.endDateText);


            START_DATE_VIEW = extensionRange.startDateText;

            if(extensionRange.startDateText !== extensionRange.endDateText) {
                END_DATE_VIEW = extensionRange.endDateText;
                handleViewDateChange(START_DATE_VIEW, END_DATE_VIEW, chartsViewsSettings, chartsViewsDataDays);
            }
        }

    });
    $('#date_range_view').datepicker('setDate', ['-1w', '+1w']);
    // Datapicker value
    var extensionRange = $('#date_range_view').datepicker('widget').data('datepickerExtensionRange');
    if (extensionRange.startDateText) $('#startDayView').val(extensionRange.startDateText);
    if (extensionRange.endDateText) $('#endDayView').val(extensionRange.endDateText);
    START_DATE_VIEW = extensionRange.startDateText;
    END_DATE_VIEW = extensionRange.endDateText;
// vars init
    var ctx = document.getElementById('adv-views').getContext('2d');
    var Checbox_element =  $('.views-select input[type="checkbox"]') ;
    var chartsViewsDataDays = {};

//Days chart

    var chartsViewsSettings = {};
    chartsViewsSettings.Days = {
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
                            return value + ' amount';
                        }
                    }
                }]
            },
        },

    };

    var ViewsChartD = function (settings) {
        window.myViewLine = new Chart(ctx, settings);
    };
    // SELECT CHECKBOX IN DROPDOWN
    $('.views-select input[type="checkbox"]').on('click', function () {
        var title_vie = $(this).closest('.views-select').find('input[type="checkbox"]').val(),
            title_vie = $(this).val() + ",";
        if ($(this).is(':checked')) {
            var html = '<span title_vie="' + title_vie + '">' + title_vie + '</span>';
            $('.view-sel').append(html);
            $(".hida").hide();
        } else {
            $('span[title_vie="' + title_vie + '"]').remove();
            var ret = $(".hida");
            $('.view-dropdown dt a').append(ret);
        }
    });




    //DRAWING
    ViewsChartD(chartsViewsSettings.Days);
    ctx.clearRect(0, 0, 800, 400);

    Checbox_element[0].checked = true;
    if (Checbox_element[0].checked){
        ShowFirstViewChecbox(Checbox_element);
        handleViewDateChange(START_DATE_VIEW, END_DATE_VIEW, chartsViewsSettings, chartsViewsDataDays);
    }

    //Действие  после изменения чекбокса
    $('.views-select input[type="checkbox"]').change(function () {
        var t = $(this);
        if(t[0].checked){
            var checkedInputID = t.attr("id");
            if(typeof chartsViewsDataDays[checkedInputID] === "undefined"){
                handleViewDateChange(START_DATE_VIEW, END_DATE_VIEW, chartsViewsSettings, chartsViewsDataDays);
            }
            addChartViews(chartsViewsSettings.Days, t, chartsViewsDataDays[checkedInputID], window.myViewLine);
        } else {
            removeChartViews(chartsViewsSettings.Days, t, window.myViewLine);

        }
    });
});




