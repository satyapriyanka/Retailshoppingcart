import { Injectable, OnDestroy } from '@angular/core';
import { AuthUser } from 'shared/models/auth.user';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, Observable, Subject, Subscribable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { auth, database } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private user: AuthUser;
  UserAuthChanges: Subject<string>;
  subs: Subscription[] = [];

  set isWaitingForResponse(value) {
    if (value) {
      localStorage.setItem("isWaitingForResponse", "true");
    } else {
      localStorage.setItem("isWaitingForResponse", "false");
    }
  }

  get isWaitingForResponse(): boolean {
    const value = localStorage.getItem("isWaitingForResponse");
    if (value === "true")
      return true;
    else
      return false;
  }

  get User() {
    return this.user;
  }

  get IsLoggedIn(): boolean {
    return !!(this.user && this.user.isLoggedIn);
  }

  get IsAdmin(): boolean {
    return this.IsLoggedIn && this.user.isAdmin;
  }

  get UserId() {
    return localStorage.getItem('useruid');
  }

  constructor(private db: AngularFirestore,
    private afAuth: AngularFireAuth) {
    this.user = new AuthUser();
    this.UserAuthChanges = new Subject();
    console.log("In auth service");
  }

  loginViaGoogle() {
    this.isWaitingForResponse = true;
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  saveLogin(authResult) {
    localStorage.setItem('useruid', authResult.uid);

    return this.db.doc(`users/${authResult.uid}`).get()
      .toPromise()
      .then(doc => {
        if (doc.exists) {
          return this.loginUser(authResult);
        }
        return this.createUser(authResult);
      })
  }

  fetchUser(): Observable<any> {
    const useruid = this.UserId;
    return this.db.doc(`users/${useruid}`).snapshotChanges()
      .pipe(map((doc) => {
        if (!doc || !doc.payload || !doc.payload.exists) {
          return false;
        }
        const dbUser = <AuthUser>doc.payload.data();
        dbUser.uid = doc.payload.id;
        this.user = dbUser;
        return dbUser;
      }))
  }

  logOut(): Promise<any> {
    const useruid = this.UserId;
    if (!useruid)
      return Promise.reject();

    return this.db.doc(`users/${this.user.uid}`).update({
      isLoggedIn: false
    }).then(() => this.afAuth.auth.signOut())
      .then(() => {
        localStorage.removeItem('useruid');
        this.user.isLoggedIn = false;
      })
  }

  private loginUser(authResult) {
    const user = this.createUserObjectFromGoogleAuth(authResult);
    const updatedUser = Object.assign(user, { isLoggedIn: true });
    return this.db.doc(`users/${this.UserId}`).set(updatedUser, {
      merge: true
    });
  }

  private createUser(authResult) {
    const dbUser = this.createUserObjectFromGoogleAuth(authResult);
    const updatedUser = Object.assign(dbUser, { isAdmin: false, isLoggedIn: true });

    return this.db.doc(`users/${this.UserId}`).set(updatedUser)
      .then(() => this.UserAuthChanges.next(this.UserId));
  }

  private createUserObjectFromGoogleAuth(authResult) {
    return {
      emailAddress: authResult.email,
      fullName: authResult.displayName
    };
  }

  ngOnDestroy() {

  }

}
