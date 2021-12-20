import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { finalize, merge, ReplaySubject, takeUntil } from 'rxjs';
import { NewKitchenware } from 'src/app/_models';
import { SearchKitchenwareParams } from 'src/app/_models/search-kitchenware-params';
import { KitchenwareService } from 'src/app/_services/kitchenware.service';

@Component({
  selector: 'app-kitchenware-edit',
  templateUrl: './kitchenware-edit.component.html',
  styleUrls: ['./kitchenware-edit.component.scss']
})
export class KitchenwareEditComponent implements AfterViewInit, OnDestroy {
  formFilter: FormGroup;
  displayedColumns = ['image', 'name', 'kitchenwareCategory', 'actions'];
  dataSource: NewKitchenware[] = [];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  isLoadingResults = true;
  resultsLength = 0;
  listCategory: string[];
  selectedKitchenware: NewKitchenware[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialogRef: MatDialogRef<KitchenwareEditComponent>,
    private kitchenwareService: KitchenwareService, 
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data: any) {
      this.selectedKitchenware = data.selectedKitchenware;
      this.listCategory = data.listCategoryKitchenware;
      this.formFilter = this.formBuilder.group({
      searchText: [],
      status: [],
      kitchenwareCategories: [],
    });
  }

  ngAfterViewInit(): void {
    this.loadData();
    this.sort.sortChange.pipe(takeUntil(this.destroy)).subscribe(() => this.paginator.pageIndex = 0);
   merge(this.sort.sortChange, this.paginator.page).pipe(takeUntil(this.destroy)).subscribe(() => this.loadData());
 }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  OnSubmitFilter(){
    this.paginator.pageIndex = 0;
    this.loadData();
  }

loadData(){
  const kitchenwareFilter: SearchKitchenwareParams = {
    name: this.searchText === null ? "" : this.searchText, order: this.sort.direction, 
    categories: this.kitchenwareCategories === null ? "": this.kitchenwareCategories, active: true
  }
  this.isLoadingResults = true;
  this.kitchenwareService.getKitchenwareList(this.paginator.pageIndex, kitchenwareFilter, 
    this.paginator.pageSize).pipe(takeUntil(this.destroy),
  finalize(() => this.isLoadingResults = false)).subscribe({
  next: data => {
      this.resultsLength = data.totalElements;
      this.dataSource = data.content;
      const matTable= document.getElementById('table');
      if(matTable)
        matTable.scrollIntoView();
  },
  error: ()=> {
  this.dataSource = [];
  }
  });
}

  addKitchenware(kitchenware: NewKitchenware){
    kitchenware.amount = 1;
    this.selectedKitchenware.push(kitchenware);
  }

  cancelAddKitchenware(kitchenwareId: string){
    this.selectedKitchenware = this.selectedKitchenware.filter(u => u.id !== kitchenwareId);
  }

  get filterControl(){
    return this.formFilter.controls;
  }

  get searchText(){
    return this.filterControl['searchText'].value;
  }

  get kitchenwareCategories(){
    return this.formFilter.controls['kitchenwareCategories'].value
  }

  checkSelectedKitchenware(id: string): boolean {
    return this.selectedKitchenware.some(kitch => kitch.id == id);
  }

  close(): void{
    this.dialogRef.close(this.selectedKitchenware);
  }

}
