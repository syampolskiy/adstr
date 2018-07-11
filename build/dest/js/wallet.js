
var ctx = document.getElementById("wallet").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['m','t','w','t','f','s','s'],
        datasets: [{
            label: '',
            data: [12, 19, 3, 5, 2, 3,7],
            backgroundColor: 'transparent',
            borderColor: "#976fcf",
            pointBackgroundColor:"#976fcf",
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: '75$',
            fontSize: 20,
            position: 'top',
            fontFamily: "Noto Sans",
            fontColor: "#34474f"
        },
        legend: false,
        layout: {
            padding: {
                left: 5,
                right: 20,
                top: 5,
                bottom: 5
            }
        },

        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: function (value) {
                        return value + '';
                    }
                }
            }]
        },

    },
});