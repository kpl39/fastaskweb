import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { QueryService } from '../../../services/query.service';
import { TaskService } from '../../../services/task.service';
import { ChartService } from '../../../services/chart.service';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'app-vendor-metrics-dashboard',
  templateUrl: './vendor-metrics-dashboard.component.html',
  styleUrls: ['./vendor-metrics-dashboard.component.css']
})
export class VendorMetricsDashboardComponent {
  userAuth: any;
  vendorInfo: any;
  tasks: any;
  activeCampaign: any;
  queryData: any;
  chartOptions: any;
  chartTypes = [{display: 'Task Views', value:'task-views'}, {display: 'Task Attempts', value:'task-attempts'}]; //{display: 'Geofence Transitions', value:'geofence-transitions'}]
  //chartType: String;
  timePeriods = [{display: 'Everything', value:'everything'}, {display: 'Single Day Hourly', value:'hourly'}, {display: 'Date Range', value:'range'}];
  //timePeriod: String = 'everything';
  queryOptions:any = {};
  constructor(
    private auth: AuthService,
    private taskService: TaskService,
    private queryService: QueryService,
    private chartService: ChartService,
    public router: Router
  ) { }

   ngOnInit() {
        this.checkLoginStatus();
    };

    checkLoginStatus() {
        this.auth.getAuthState()
            .then((userAuth) => {
                console.log("UserAuth", userAuth);
                if (!this.auth.isAuthenticated()) {
                    this.router.navigate(['login'])
                 } else {
                   this.userAuth = userAuth;
                   this.getVendorInfo();
                 }
            }) 
      };

    getVendorInfo() {
      console.log("Vendor Info");
      this.auth.getVendorInfo(this.userAuth.uid)
        .then((vendorInfo:any) => {
          console.log("VENDOR INFO", vendorInfo);
          this.vendorInfo = vendorInfo;
          this.getVendorTasks();
        })
    }

    getVendorTasks() {
      this.taskService.getVendorTasks(this.vendorInfo.id)
        .then((tasks:any) => {
          console.log("VENDOR TASKS", tasks);
          if (tasks) {
            this.tasks = tasks;
            this.activeCampaign = tasks[0];
            this.buildQuery();
          }
         
        })
    }

    makeActiveCampaign(index) {
      console.log("ACTIVE CAMPAIGN: ", index);
      this.activeCampaign = this.tasks[index];
    }

    goToAddCampaign() {
      console.log("GO TO ADD CAMPAIGN")
      this.router.navigate(['vendor-dashboard/addtask'])
    }

    buildQuery() {
      // let query = 'Select count(date_tm::date) as viewcount, date_tm::date as count_date from task_views where taskid = 11 group by count_date order by count_date ASC';
      // let query = "SELECT EXTRACT(HOUR FROM date_tm) as hour, count(EXTRACT(HOUR FROM date_tm)) as viewcount, date_tm::date as count_date from task_views where date_tm::date = '2017-08-25' group by hour, count_date ORDER BY hour ASC"
      // let values = []
      // let name = 'Mustache Ride Task Views'
      // let pkg = {
      //   query: query,
      //   values: values,
      //   name: name
      // };
      this.queryOptions.timePeriod = this.queryOptions.timePeriod || 'everything';
      this.queryOptions.taskid = this.activeCampaign.id

      this.queryService.buildQuery(this.queryOptions)
        .then((data) => {
          this.queryData = data;
          this.makeChart();
          console.log("QUERY DATA", data);
        })
    }

    makeChart() {
      let data = [];
      this.queryData.forEach((record) => {
        let date = new Date(record.count_date);
        if (record.hour) {
          date.setHours(record.hour);
        }
        data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()), +record.viewcount])
      })
      console.log("Chart Data", data);
      this.chartOptions = this.chartService.makeViewsChart(data)
    }

  changeChart(chart) {
    console.log("Chart Change", chart);
  }

  changeTimePeriod(time) {
    console.log("Time Period", time);

  }

  logDate(date) {
    console.log("DATE", date);
  }

// 'SELECT EXTRACT(HOUR FROM date_tm) as hour, count(EXTRACT(HOUR FROM date_tm)) as hourlycount, date_tm::date as count_date from task_views where date_tm::date = "2017-08-25" group by hour, count_date'

    
    

}
