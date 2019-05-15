import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, database } from 'firebase/app';
import { AuthService } from 'shared/services/auth/auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isAuthLoading: boolean = false;

  constructor(private afAuth: AngularFireAuth,
    public authService: AuthService) {
      
  }

  ngOnInit() {
    if(!localStorage.getItem('redirectUrl')){
      localStorage.setItem('redirectUrl', "/");
    }
  }

  login() {
    this.authService.loginViaGoogle();
  }



}
