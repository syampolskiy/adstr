function addChartTime(chrtStngs, chkbxVl, chrtDataWeek, cnvs){
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

function removeChartTime(chrtStngs, chkbxVl, cnvs){
  chrtStngs.data.datasets.forEach(function (currentValue, i) {
    if (chrtStngs.data.datasets[i].label == chkbxVl.val()) {
      chrtStngs.data.datasets.splice(i, 1);
      cnvs.update();
    }
  });

}

function getCheckedIDsTIME() {
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

function ShowFirstChecboxTime(chkBx) {
  var title = chkBx.val() + ",";
  var html = '<span title="' + title + '">' + title + '</span>';
  $('.timeChart').append(html);
  $(".hida").hide();
}

function div(val, by){
  return (val - val % by) / by;
}

function getChartsDataTime(checkboxesID, dateStart, dateEnd){
  var colors = ['#D36969','#8F9BFF','#B76298','#56A555','#DEAC17','#FD72FE','#7278FE','#fe98e5','#2C1395','#DA70D6','#E9967A','#64078D','#00E62C','#E60091','#007069','#700400'];
  var ordID = checkboxesID.join(",");

  //на беке загнать данные в ассоциативный массив и перегнать его в json json_encode(); в таком виде:
  var resultTimeChart = {
    timedays: {
      labels: [],
      TimechannelsId: {}
    },
    timeweeks: {
      labels: [],
      TimechannelsId: {}
    }
  };
  // $(".loading-overlay").addClass('hide');
  $.ajax({
    url: "http://rusvald.ddns.ukrtel.net/Admin/ChartsStreamer/Income",
    type: "POST",
    data: {orderId: ordID,  startDate: dateStart, endDate:  dateEnd},
    dataType: "json",
    async: false,
    success: function (data) {
      if(!data.error){
        //Labels for CHART
        resultTimeChart.timedays.labels = data.chartData.timedays.labels.slice(0);
        var TimedaysLabels = resultTimeChart.timedays.labels;
        var TimedaysLabelsLen = TimedaysLabels.length;

        for(i = 0; i < Math.ceil(TimedaysLabelsLen/7); ++i){
          var ind = i*7;
          resultTimeChart.timeweeks.labels[i] = TimedaysLabels[ind];
        }

        //Values for CHART
        resultTimeChart.timedays.TimechannelsId = JSON.stringify(data.chartData.timedays.TimechannelsId);
        resultTimeChart.timedays.TimechannelsId = JSON.parse(resultTimeChart.timedays.TimechannelsId);
      } else {
        console.log(data);
      }
    }, error: function (data) {
      console.log(data);
    }
  });
  // $(".loading-overlay").removeClass('hide');
  return resultTimeChart;
}

function setDaysDataTime(chrtStngs, dataArr, data, chrt){
  chrtStngs.TimeDays.data.labels = data.timedays.labels;

  $.each(data.timedays.TimechannelsId, function (index, value) {
    dataArr[index] =  value;
    removeChartTime(chrtStngs.TimeDays, $("#channel_"+index), chrt);
    addChartTime(chrtStngs.TimeDays, $("#channel_"+index), dataArr[index], chrt);
  });
}

function setWeeksDataTime(chrtStngs, dataArr, data, chrt){

  $.each(data.timedays.TimechannelsId, function (index, value) {
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


    chrtStngs.timeWeeks.data.labels = data.timeweeks.labels;


    removeChartTime(chrtStngs.timeWeeks, $("#channel_"+index), chrt);
    addChartTime(chrtStngs.timeWeeks, $("#channel_"+index), dataArr[index], chrt);
  });
}


// function dateforWeeks(){
//   var tmp = [];
//   $.each($("#date_range_time td.selected"), function (i) {
//     tmp.push($(this).children("a").text()+"."+$(this).attr("data-month")+"."+$(this).attr("data-year"));
//   });
//   return tmp;
// }

function handleDateChangeTime(s_date, e_date, chS, chDD, chDW){
  setTimeout(function() {
    var checkedIDs = getCheckedIDsTIME();
    var data = getChartsDataTime(checkedIDs, s_date, e_date);

    setDaysDataTime(chS, chDD, data, window.timeChartLine);
    setWeeksDataTime(chS, chDW, data, window.timeChartLine2);
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
        handleDateChangeTime(START_DATE, END_DATE, chartsSettingsTime, chartsDataDaysTime, chartsDataWeeksTime);
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
  var Timectx = document.getElementById('stream-time').getContext('2d');
  var Timectx2 = document.getElementById('stream-time2').getContext('2d');
  var TimeChecbox_element =  $('.timeChart_select input[type="checkbox"]') ;
  var chartsDataDaysTime = {};
  var chartsDataWeeksTime = {};
//Days chart

  var chartsSettingsTime = {};
  chartsSettingsTime.TimeDays = {
    type: 'bars',
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
  chartsSettingsTime.timeWeeks = {
    type: 'bars',
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

  var TimeDays = function (settings) {
    window.timeChartLine = new Chart(Timectx, settings);
  };
  var TimeWeeks = function (settings) {
    window.timeChartLine2 = new Chart(Timectx2, settings);
  };

  $(".timeChartIdsMenu dt a").on('click', function () {
    $(".timeChartIdsMenu dd ul").slideToggle('fast');
  });

  $(".timeChartIdsMenu dd ul li a").on('click', function () {
    $(".timeChartIdsMenu dd ul").hide();
  });

  $(document).bind('click', function (e) {
    var $clicked = $(e.target);
    if (!$clicked.parents().hasClass("timeChartIdsMenu")) $(".timeChartIdsMenu dd ul").hide();
  });

  // SELECT CHECKBOX IN timeChartIdsMenu
  $('.timeChart_select input[type="checkbox"]').on('click', function () {
    var title = $(this).closest('.timeChart_select').find('input[type="checkbox"]').val(),
     title = $(this).val() + ",";
    if ($(this).is(':checked')) {
      var html = '<span title="' + title + '">' + title + '</span>';
      $('.timeChart').append(html);
      $(".hida").hide();
    } else {
      $('span[title="' + title + '"]').remove();
      var ret = $(".hida");
      $('.timeChartIdsMenu dt a').append(ret);
    }
  });


  // Toggle chars DAYS || WEEKS
  $("input[name='toggle']").change(function () {
    $("#stream-time, #stream-time2").toggleClass("show");
  });

  //DRAWING
  TimeWeeks(chartsSettingsTime.timeWeeks);
  TimeDays(chartsSettingsTime.TimeDays);
  Timectx.clearRect(0, 0, 800, 400);
  Timectx2.clearRect(0, 0, 800, 400);

  TimeChecbox_element[0].checked = true;
  if (TimeChecbox_element[0].checked){
    ShowFirstChecboxTime(TimeChecbox_element);
    handleDateChangeTime(START_DATE_TIME, END_DATE_TIME, chartsSettingsTime, chartsDataDaysTime, chartsDataWeeksTime);
  }

  //Действие  после изменения чекбокса
  $('.timeChart_select input[type="checkbox"]').change(function () {
    var t = $(this);
    if(t[0].checked){
      var checkedInputTimeID = t.attr("id");
      if(typeof chartsDataDaysTime[checkedInputTimeID] === "undefined" && typeof chartsDataWeeksTime[checkedInputTimeID] === "undefined"){
        handleDateChangeTime(START_DATE_TIME, END_DATE_TIME, chartsSettingsTime, chartsDataDaysTime, chartsDataWeeksTime);
      }

      addChartTime(chartsSettingsTime.TimeDays, t, chartsDataDaysTime[checkedInputTimeID], window.timeChartLine);
      addChartTime(chartsSettingsTime.timeWeeks, t, chartsDataWeeksTime[checkedInputTimeID], window.timeChartLine2);
    } else {
      removeChartTime(chartsSettingsTime.TimeDays, t, window.timeChartLine);
      removeChartTime(chartsSettingsTime.timeWeeks, t, window.timeChartLine2);
    }
  });
});




