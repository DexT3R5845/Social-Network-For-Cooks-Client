import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ingredient } from 'src/app/_models';
import { IngredientService } from 'src/app/_services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'image', 'name', 'category', 'active', 'actions'];
  dataSource: MatTableDataSource<Ingredient>;
  index: number;
  id: number;

  constructor(private ingredientService : IngredientService
              // public dialog: MatDialog,
              // public dataService: DataService
              ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;
   @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.loadData();
    //this.loadData();
  }

  refresh() {
    //this.loadData();
  }

  addNew() {
    // const dialogRef = this.dialog.open(AddDialogComponent, {
    //   data: {issue: Issue }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 1) {
    //     // After dialog is closed we're doing frontend updates
    //     // For add we're just pushing a new row inside DataService
    //     this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
    //     this.refreshTable();
    //   }
    // });
  }

  startEdit(i: number, id: number, title: string, state: string, url: string, created_at: string, updated_at: string) {
    // this.id = id;
    // // index row is used just for debugging proposes and can be removed
    // this.index = i;
    // console.log(this.index);
    // const dialogRef = this.dialog.open(EditDialogComponent, {
    //   data: {id: id, title: title, state: state, url: url, created_at: created_at, updated_at: updated_at}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 1) {
    //     // When using an edit things are little different, firstly we find record inside DataService by id
    //     const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
    //     // Then you update that record using data from dialogData (values you enetered)
    //     this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
    //     // And lastly refresh table
    //     this.refreshTable();
    //   }
    // });
  }

  deleteItem(i: number, id: number, title: string, state: string, url: string) {
    // this.index = i;
    // this.id = id;
    // const dialogRef = this.dialog.open(DeleteDialogComponent, {
    //   data: {id: id, title: title, state: state, url: url}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 1) {
    //     const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
    //     // for delete we use splice in order to remove single object from DataService
    //     this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
    //     this.refreshTable();
    //   }
    // });
  }


  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    //this.paginator._changePageSize(this.paginator.pageSize);
  }


  /*   // If you don't need a filter or a pagination this can be simplified, you just use code from else block
    // OLD METHOD:
    // if there's a paginator active we're using it for refresh
    if (this.dataSource._paginator.hasNextPage()) {
      this.dataSource._paginator.nextPage();
      this.dataSource._paginator.previousPage();
      // in case we're on last page this if will tick
    } else if (this.dataSource._paginator.hasPreviousPage()) {
      this.dataSource._paginator.previousPage();
      this.dataSource._paginator.nextPage();
      // in all other cases including active filter we do it like this
    } else {
      this.dataSource.filter = '';
      this.dataSource.filter = this.filter.nativeElement.value;
    }*/



  public loadData() {
    this.ingredientService.getAll()
      .subscribe((data: Ingredient[]) => {
        console.log(data);
        this.dataSource.data = data;
        return data;
    });
  }
}
