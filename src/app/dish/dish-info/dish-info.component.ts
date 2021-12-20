import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReplaySubject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import { Dish } from '../../_models';
import { AlertService, DishService } from '../../_services';

@Component({
  selector: 'app-dish-info',
  templateUrl: './dish-info.component.html',
  styleUrls: ['./dish-info.component.scss'],
})
export class DishInfoComponent implements OnInit {

  dishInfo: Dish;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  isNotFound: boolean = false;

  constructor(private dishService: DishService, private route: ActivatedRoute, private alertService: AlertService, private router: Router) {
  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id && Number(id)) {
      this.getDishInfo(id);
    }
    else {
      this.router.navigateByUrl("/dishes");
    }
  }

  private getDishInfo(id: string) : void {
    this.dishService.getDishById(id)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          this.dishInfo = response;
          },
          error: error => {
            this.displayError(error);
          }}
      )
  }
  
  displayError(error: any) : void {
    switch (error.status) {
      case 400:
        this.alertService.error("Something went wrong",true,true);
        break;
      case 404:
        this.isNotFound = true;
        break;
      default:
        this.alertService.error("There was an error on the server, please try again later.",true,true);
        break;
    }
    
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
