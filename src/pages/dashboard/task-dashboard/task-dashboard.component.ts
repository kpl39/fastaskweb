import { Component } from '@angular/core';
import { HomeComponent } from '../../home/home.component';
import { AuthService } from '../../../services/auth.service';
// import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.css']
})
export class TaskDashboardComponent {

  constructor(
      private auth: AuthService
    ) {}

    ngOnInit() {
        console.log("IN Task DASHBOARD");
    }

}