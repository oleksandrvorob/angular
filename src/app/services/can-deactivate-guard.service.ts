import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
	canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
  }

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuardService implements CanDeactivate<CanComponentDeactivate> {

	constructor() { }

	canDeactivate(component: CanComponentDeactivate,
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot) {

		let url: string = state.url;

		return component.canDeactivate ? component.canDeactivate() : true;
	}
}
