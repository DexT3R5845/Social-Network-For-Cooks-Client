import { Injectable } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { filter, Observable, Subject } from "rxjs";
import { AlertMessage, TypeAlert } from "../_models/alert.message";

@Injectable({
    providedIn: 'root'
  })
export class AlertService {
    private subject: Subject<AlertMessage | null> = new Subject<AlertMessage | null>();
    private keepAfterRouteChange: boolean = false;
    private defaultId: string = 'default-alert';

    constructor(private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    this.keepAfterRouteChange = false;
                } else {
                    this.clear();
                }
            }
        });
    }

    OnAlert(id = this.defaultId): Observable<AlertMessage|null> {
        return this.subject.asObservable().pipe(filter(x => x !=null ? x.id === id : true));
    }

    success(message: string, keepAfterRouteChange = false, autoClose = false, componentID = this.defaultId): void {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: TypeAlert.SUCCESS, text: message, id: componentID, autoClose: autoClose });
    }

    error(message: string, keepAfterRouteChange = false, autoClose = false, componentID = this.defaultId): void {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: TypeAlert.ERROR, text: message, id: componentID, autoClose: autoClose });
    }

    clear(): void {
        this.subject.next(null);
    }
}