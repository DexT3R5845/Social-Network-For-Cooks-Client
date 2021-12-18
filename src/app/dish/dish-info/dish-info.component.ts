import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReplaySubject, takeUntil} from 'rxjs';
import {Profile} from 'src/app/_models/profile';
import {ProfileService} from 'src/app/_services/profile.service';
import {ActivatedRoute, Router} from "@angular/router";
import { Dish } from '../../_models';
import { AlertService, DishService } from '../../_services';

@Component({
  selector: 'app-dish-info',
  templateUrl: './dish-info.component.html',
  styleUrls: ['./dish-info.component.scss']
})
export class DishInfoComponent implements OnInit {

  dishInfo: Dish;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(private dishService: DishService, private route: ActivatedRoute, private alertService: AlertService) {
  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getDishInfo(id);
    }
  }

  private getDishInfo(id: string) : void {
    this.dishService.getDishById(id)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          this.dishInfo = response;
          },
          error: () => {
            this.alertService.error("There was an error on the server, please try again later.");
          }}
      )
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
