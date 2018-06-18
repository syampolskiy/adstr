function addChartVF(chrtStngs, chkbxVl, chrtDataVF, cnvs){
    var newDataset = {
        label: chkbxVl.val(),
        borderColor: rndColor(),
        backgroundColor: 'transparent',
        data: chrtDataVF,
    };

    var tmp = chrtStngs.data.datasets;
    tmp[tmp.length] = newDataset;
    cnvs.update();
}

function removeChartVF(chrtStngs, chkbxVl, cnvs){
    chrtStngs.data.datasets.forEach(function (currentValue, i) {
        if (chrtStngs.data.datasets[i].label == chkbxVl.val()) {
            chrtStngs.data.datasets.splice(i, 1);
            cnvs.update();
        }
    });

}

function getCheckedIDsVF() {
    var resVF = [];
    $.each($('.mutliSelect_followers input[type="checkbox"]:checked'), function (i) {
        var id = parseInt($(this).attr("id").split("_")[1]);
        resVF.push(id);
    });
    return resVF;
}

function rndColor() {
    return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
}

function ShowFirstChecboxVF(chkBx) {
    var title = chkBx.val() + ",";
    var html = '<span title="' + title + '">' + title + '</span>';
    $('.multiSel').append(html);
    $(".hida").hide();
}

function div(val, by){
    return (val - val % by) / by;
}

function getChartsDataVF(checkboxesID, dateStart, dateEnd){
    var colors = ['#D36969','#8F9BFF','#B76298','#56A555','#DEAC17','#FD72FE','#7278FE','#fe98e5','#2C1395','#DA70D6','#E9967A','#64078D','#00E62C','#E60091','#007069','#700400'];
    var ordIDVF = checkboxesID.join(",");

    //на беке загнать данные в ассоциативный массив и перегнать его в json json_encode(); в таком виде:
    var resultVF = {
        views: {
            labels: [],
            channelsVFId: {}
        },
        followers: {
            labels: [],
            channelsVFId: {}
        }
    };
    // $(".loading-overlay").addClass('hide');
    $.ajax({
        url: "http://rusvald.ddns.ukrtel.net/Admin/ChartsStreamer/Income",
        type: "POST",
        data: {orderId: ordIDVF,  startDate: dateStart, endDate:  dateEnd},
        dataType: "json",
        async: false,
        success: function (data) {
            if(!data.error){
                //Labels for CHART
                resultVF.views.labels = data.chartData.views.labels.slice(0);
                var daysLabels = resultVF.views.labels;
                var daysLabelsLen = daysLabels.length;

                for(i = 0; i < Math.ceil(daysLabelsLen/7); ++i){
                    var ind = i*7;
                    resultVF.followers.labels[i] = daysLabels[ind];
                }

                //Values for CHART
                resultVF.views.channelsVFId = JSON.stringify(data.chartData.views.channelsVFId);
                resultVF.views.channelsVFId = JSON.parse(resultVF.views.channelsVFId);
            } else {
                console.log(data);
            }
        }, error: function (data) {
            console.log(data);
        }
    });
    // $(".loading-overlay").removeClass('hide');
    return resultVF;
}

function setViewsDataVF(chrtStngs, dataArr, data, chrt){
    chrtStngs.Views.data.labels = data.views.labels;

    $.each(data.views.channelsVFId, function (index, value) {
        dataArr[index] =  value;
        removeChartVF(chrtStngs.Views, $("#channel_"+index), chrt);
        addChartVF(chrtStngs.Views, $("#channel_"+index), dataArr[index], chrt);
    });
}

function setFollowersDataVF(chrtStngs, dataArr, data, chrt){

    $.each(data.views.channelsVFId, function (index, value) {
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


        chrtStngs.Followers.data.labels = data.followers.labels;


        removeChartVF(chrtStngs.Followers, $("#channel_"+index), chrt);
        addChartVF(chrtStngs.Followers, $("#channel_"+index), dataArr[index], chrt);
    });
}


// function dateforWeeks(){
//     var tmp = [];
//     $.each($("#date_range_followers td.selected"), function (i) {
//         tmp.push($(this).children("a").text()+"."+$(this).attr("data-month")+"."+$(this).attr("data-year"));
//     });
//     return tmp;
// }

function handleDateChangeVF(s_date, e_date, chS, chDD, chDW){
    setTimeout(function() {
        var checkedIDs = getCheckedIDsVF();
        var data = getChartsDataVF(checkedIDs, s_date, e_date);

        setViewsDataVF(chS, chDD, data, window.VFLine);
        setFollowersDataVF(chS, chDW, data, window.VFLine2);
    }, 100);
}

$(function () {
    START_DATEVF = -1;
    END_DATEVF = -1;
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


            START_DATEVF = extensionRange.startDateText;

            if(extensionRange.startDateText !== extensionRange.endDateText) {
                END_DATEVF = extensionRange.endDateText;
                handleDateChangeVF(START_DATEVF, END_DATEVF, chartsSettingsVF, chartsDataViews, chartsDataFollowers);
            }
        }

    });
    $('#date_range_followers').datepicker('setDate', ['-1w', '+1w']);
    // Datapicker value
    var extensionRange = $('#date_range_followers').datepicker('widget').data('datepickerExtensionRange');
    if (extensionRange.startDateText) $('#startDayFollowers').val(extensionRange.startDateText);
    if (extensionRange.endDateText) $('#endDayFollowers').val(extensionRange.endDateText);
    START_DATEVF = extensionRange.startDateText;
    END_DATEVF = extensionRange.endDateText;
// vars init
    var ctx = document.getElementById('stream-followers').getContext('2d');
    var ctx2 = document.getElementById('stream-followers2').getContext('2d');
    var Checbox_elementVF =  $('.mutliSelect_followers input[type="checkbox"]') ;
    var chartsDataViews = {};
    var chartsDataFollowers = {};
//Days chart

    var chartsSettingsVF = {};
    chartsSettingsVF.Views = {
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
                            return ' ' + value;
                        }
                    }
                }]
            },
        },

    };
    chartsSettingsVF.Followers = {
        type: 'line',
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
                            return ' ' + value;
                        }
                    }
                }]
            },
        }
    };

    var VFViews = function (settings) {
        window.VFLine = new Chart(ctx, settings);
    };
    var VFFollowers = function (settings) {
        window.VFLine2 = new Chart(ctx2, settings);
    };

    // SELECT CHECKBOX IN DROPDOWN
    $('.mutliSelect_followers input[type="checkbox"]').on('click', function () {
        var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
            title = $(this).val() + ",";
        if ($(this).is(':checked')) {
            var html = '<span title="' + title + '">' + title + '</span>';
            $('.multiSel').append(html);
            $(".hida").hide();
        } else {
            $('span[title="' + title + '"]').remove();
            var ret = $(".hida");
            $('.dropdown dt a').append(ret);
        }
    });


    // Toggle chars DAYS || WEEKS
    $("input[name='toggle']").change(function () {
        $("#stream-followers, #stream-followers2").toggleClass("show");
    });

    //DRAWING
    VFFollowers(chartsSettingsVF.Followers);
    VFViews(chartsSettingsVF.Views);
    ctx.clearRect(0, 0, 800, 400);
    ctx2.clearRect(0, 0, 800, 400);

    Checbox_elementVF[0].checked = true;
    if (Checbox_elementVF[0].checked){
        ShowFirstChecboxVF(Checbox_elementVF);
        handleDateChangeVF(START_DATEVF, END_DATEVF, chartsSettingsVF, chartsDataViews, chartsDataFollowers);
    }

    //Действие  после изменения чекбокса
    $('.mutliSelect_followers input[type="checkbox"]').change(function () {
        var t = $(this);
        if(t[0].checked){
            var checkedInputIDVF = t.attr("id");
            if(typeof chartsDataViews[checkedInputIDVF] === "undefined" && typeof chartsDataFollowers[checkedInputIDVF] === "undefined"){
                handleDateChangeVF(START_DATEVF, END_DATEVF, chartsSettingsVF, chartsDataViews, chartsDataFollowers);
            }

            addChartVF(chartsSettingsVF.Views, t, chartsDataViews[checkedInputIDVF], window.VFLine);
            addChartVF(chartsSettingsVF.Followers, t, chartsDataFollowers[checkedInputIDVF], window.VFLine2);
        } else {
            removeChartVF(chartsSettingsVF.Views, t, window.VFLine);
            removeChartVF(chartsSettingsVF.Followers, t, window.VFLine2);
        }
    });
});




