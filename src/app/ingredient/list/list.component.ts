import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, ReplaySubject, startWith, switchMap, of as observableOf } from 'rxjs';
import { Ingredient } from 'src/app/_models';
import { IngredientService } from 'src/app/_services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements AfterViewInit, OnDestroy {
  displayedColumns = ['id', 'image', 'name', 'category', 'active', 'actions'];
  dataSource: Ingredient[] = [];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  isLoadingResults = true;
  isRateLimitReached = false;
  resultsLength = 0;

  constructor(private ingredientService : IngredientService
              ) {}

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;
   @ViewChild('filter', { static: true }) filter: ElementRef;

   ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.ingredientService.getAll(
            // this.sort.active,
            // this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
          ).pipe(catchError(() => observableOf(null)));;
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.totalElements;
          return data.content;
        }),
      )
      .subscribe(data => (this.dataSource = data));
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
}

