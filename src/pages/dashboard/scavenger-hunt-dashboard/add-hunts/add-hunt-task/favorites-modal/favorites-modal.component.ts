import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../../../../services/task.service';
import {  MdDialogRef} from '@angular/material';
@Component({
  selector: 'app-favorites-modal',
  templateUrl: './favorites-modal.component.html',
  styleUrls: ['./favorites-modal.component.css']
})
export class FavoritesModalComponent implements OnInit {
  userid: number;
  userFavorites = [];
  globalFavorites = [];

  constructor(
    private taskService: TaskService,
    public dialogRef: MdDialogRef<FavoritesModalComponent>
  ) { }

  ngOnInit() {
    this.getFavorites();
  }

  getFavorites() {
    this.taskService.getFavoriteTasks(this.userid)
      .then((data:any) => {
        data.forEach((task) => {
          if (task.owner_id === this.userid || task.fav_id) {
            this.userFavorites.push(task);
          } else {
            this.globalFavorites.push(task);
          }
        })
      })
  }

}
