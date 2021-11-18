import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { RequestInterceptor } from '../interceptor';
import { TestService } from '../test.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(private router: Router, private testService: TestService) { }

  ngOnInit(): void {
    this.testService.sendRequest().pipe(first())
    .subscribe(response => console.log(response));
  }

  // logout(): void {
  //   this.testService.logout();
  //   this.router.navigate(['signin']);
  // }

}
