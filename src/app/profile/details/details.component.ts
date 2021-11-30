import { Component, OnInit } from '@angular/core';
import { CookieStorageService } from 'src/app/_helpers/cookies.storage';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  constructor(private cookie: CookieStorageService) { }

  ngOnInit(): void {
    
  }

}
