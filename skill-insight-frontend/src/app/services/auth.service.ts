import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  tap,
  throwError
} from 'rxjs';

import {
  catchError
} from 'rxjs/operators';

import {
  environment
} from '@env/environment';

import {
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_API =
    environment.api.auth;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  //
  // LOGIN
  //
  login(data: any): Observable<any> {

    return this.http.post(
      `${this.AUTH_API}/login`,
      data
    ).pipe(

      tap((res: any) => {

        console.log(
          'LOGIN RESPONSE:',
          res
        );

        if (
          res?.success &&
          res?.user
        ) {

          this.saveUser(
            res.user
          );

          const token =
            res.accessToken ||
            res.token;

          if (token) {

            localStorage.setItem(
              'accessToken',
              token
            );

            console.log(
              'TOKEN SAVED'
            );

          } else {

            this.clearUser();

            this.router.navigate([
              '/login'
            ]);

          }

        } else {

          this.clearUser();

          this.router.navigate([
            '/login'
          ]);

        }

      }),

      catchError(err => {

        this.clearUser();

        this.router.navigate([
          '/login'
        ]);

        return throwError(
          () => err
        );

      })

    );

  }

  //
  // REGISTER
  //
  register(
    data: any
  ): Observable<any> {

    return this.http.post(
      `${this.AUTH_API}/register`,
      data
    );

  }

  //
  // GET CURRENT USER
  //
  getMe(): Observable<any> {

    const token =
      localStorage.getItem(
        'accessToken'
      );

    if (
      !token ||
      token === 'null' ||
      token === 'undefined'
    ) {

      this.clearUser();

      this.router.navigate([
        '/login'
      ]);

      return throwError(
        () => new Error(
          'No token'
        )
      );

    }

    return this.http.get(
      `${this.AUTH_API}/me`
    ).pipe(

      tap((res: any) => {

        console.log(
          'GET ME RESPONSE:',
          res
        );

        if (
          res?.success &&
          res?.user
        ) {

          this.saveUser(
            res.user
          );

        } else {

          this.clearUser();

          this.router.navigate([
            '/login'
          ]);

        }

      }),

      catchError(err => {

        console.error(
          'GET ME ERROR:',
          err
        );

        this.clearUser();

        this.router.navigate([
          '/login'
        ]);

        return throwError(
          () => err
        );

      })

    );

  }

  //
  // MEZON URL
  //
  getMezonUrl():
  Observable<any> {

    return this.http.get(
      `${this.AUTH_API}/mezon`
    );

  }

  //
  // UPDATE ROLE
  //
  updateRole(
    data: {
      userId: number;
      role: string;
    }
  ): Observable<any> {

    return this.http.put(
      `${this.AUTH_API}/users/${data.userId}/role`,
      {
        role: data.role
      }
    ).pipe(

      tap((res: any) => {

        if (
          res?.success &&
          res?.user
        ) {

          this.saveUser(
            res.user
          );

        }

      }),

      catchError(err => {

        return throwError(
          () => err
        );

      })

    );

  }

  //
  // GET USER
  //
  getUser(): any {

    const user =
      localStorage.getItem(
        'user'
      );

    try {

      return user
        ? JSON.parse(user)
        : null;

    } catch {

      return null;

    }

  }

  //
  // CURRENT USER
  //
  getCurrentUser() {

    return JSON.parse(
      localStorage.getItem(
        'user'
      ) || '{}'
    );

  }

  //
  // SAVE USER
  //
  saveUser(
    user: any
  ): void {

    if (user) {

      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );

    }

  }

  //
  // CLEAR USER
  //
  clearUser(): void {

    localStorage.removeItem(
      'user'
    );

    localStorage.removeItem(
      'accessToken'
    );

  }

  //
  // LOGOUT
  //
  logout():
  Observable<any> {

    this.clearUser();

    this.router.navigate(
      ['/login'],
      {
        replaceUrl: true
      }
    );

    return this.http.post(
      `${this.AUTH_API}/logout`,
      {}
    );

  }

  //
  // UPDATE PROFILE
  //
  updateProfile(
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.AUTH_API}/profile`,
      data
    ).pipe(

      tap((res: any) => {

        if (
          res?.success &&
          res?.user
        ) {

          this.saveUser(
            res.user
          );

        }

      }),

      catchError(err => {

        return throwError(
          () => err
        );

      })

    );

  }

}