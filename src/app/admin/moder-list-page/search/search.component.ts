import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { FormGroup} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() searchForm: FormGroup;
  @Output() searchFormEmitter = new EventEmitter<FormGroup>();


  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.searchFormEmitter.emit(this.searchForm);
  }
}




