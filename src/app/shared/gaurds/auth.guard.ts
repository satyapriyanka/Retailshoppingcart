import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'shared/services/auth/auth-service.service';
import { AuthUser } from 'shared/models/auth.user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authSerrvice: AuthService, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(this.authSerrvice.IsLoggedIn) {
      return true;
    }

    return this.authSerrvice.fetchUser().pipe(map((result: AuthUser) => {
      if(!result.isLoggedIn) {
        localStorage.setItem("redirectUrl", state.url);
        this.router.navigate(["/login"]);
      }
    
      return result.isLoggedIn;
    }));
  }
}
