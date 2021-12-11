import { Injectable } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { filter, Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterRouteChange = false;
    private defaultId = 'default-alert';

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

    OnAlert(id = this.defaultId): Observable<any> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    success(message: string, keepAfterRouteChange = false, componentID = this.defaultId) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: 'success', text: message, id: componentID });
    }

    error(message: string, keepAfterRouteChange = false, componentID = this.defaultId) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: 'error', text: message, id: componentID });
    }

    clear() {
        this.subject.next(null);
    }
}