import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup = this.createFormGroup();
  @Output() searchFormEmitter = new EventEmitter<FormGroup>();

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.searchFormEmitter.emit(this.searchForm);
  }

  private createFormGroup(): FormGroup {
    return new FormGroup({
      "search": new FormControl(""),
      "order": new FormControl("asc"),
      "gender": new FormControl(""),
      "status": new FormControl("")
    });
  }
}




