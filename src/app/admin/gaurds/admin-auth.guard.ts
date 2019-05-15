import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'shared/services/auth/auth-service.service';
import { map } from 'rxjs/operators';
import { AuthUser } from 'shared/models/auth.user';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.IsAdmin)
      return true;

    return this.authService.fetchUser().pipe(map((result: AuthUser) => {
      if (!result.isAdmin) {
        this.router.navigate(["/"]);
      }

      return result.isAdmin;
    }));

  }
}
