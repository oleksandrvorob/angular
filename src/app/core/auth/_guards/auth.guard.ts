// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// NGRX
import { select, Store } from '@ngrx/store';
// Auth reducers and selectors
import { AppState} from '../../../core/reducers/';
import { isLoggedIn } from '../_selectors/auth.selectors';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  {
        const login_token = localStorage.getItem('logistic_login_access_token');

       if(login_token==='undefinded' || login_token===null || login_token===""){
         this.router.navigate(['/auth/login']);
         return false;
       }
       else if(login_token){
            return true;
       }
    }
}
