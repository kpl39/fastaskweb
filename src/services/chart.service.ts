import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';



@Injectable()
export class ChartService {
    user: any;

constructor(
    
    ) {}



    makeChart() {
        let categories = ['18-20','21-24', '25-29', '30-34', '35-39', '40-44','45-49', '50-54', '55-59', '60-64', '65+'];

        let options = {
        chart: {
            type: 'bar',
            width: 475
        },
        title: {
            text: 'User Base for Your Area'
        },
        // subtitle: {
        //     text: 'Source: <a href="http://populationpyramid.net/germany/2015/">Population Pyramids of the World from 1950 to 2100</a>'
        // },
        xAxis: [{
            categories: categories,
            reversed: false,
            labels: {
                step: 1
            }
        }, { // mirror axis on right side
            opposite: true,
            reversed: false,
            categories: categories,
            linkedTo: 0,
            labels: {
                step: 1
            }
        }],
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return Math.abs(this.value) + '%';
                }
            }
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                    'User Base: ' + Math.abs(this.point.y) + '%';
            }
        },
        credits: {
            enabled: false
        },

        exporting: {
            enabled: false
        },   

        series: [{
            name: 'Male',
            data: [-20, -25, -19, -16, -8, -5, -2, -1, -1, -1, -2]
        }, {
            name: 'Female',
            data: [22, 25, 19, 8, 12, 7, 2, 1, 1, 1, 2]
        }]
    };
    return options;
}

makeTimeChart() {
    let options = {
        chart: {
            type: 'line',
            width: 475
        },
        title: {
            text: 'Number of Users for Promotion by Hour'
        },
        // subtitle: {
        //     text: 'Source: WorldClimate.com'
        // },
        xAxis: {
            categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
              title: {
                text: 'Hours'
            }
        },
        yAxis: {
            title: {
                text: 'Users'
            }
        },
        
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Users',
            data: [0, 5000, 10000, 8000, 7000, 12000, 10000, 7500, 5000, 4000, 3000, 1000]
        }],
        credits: {
            enabled: false
        },

        exporting: {
            enabled: false
        },  
    }
    return options;
}

makeViewsChart(data) {
    console.log("DATA", data);
    let options = {
        chart: {
            zoomType: 'x',
            type: 'line'
        },
        title: {
            text: 'Task Views By Date'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Views'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    }
                    
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            name: 'Task Views',
            data: data
        }]
    };
    return options;
}

}
