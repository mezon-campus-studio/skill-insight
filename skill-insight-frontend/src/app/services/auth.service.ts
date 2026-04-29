import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginWithMezon() {
    // sessionStorage.setItem('oauth_state', state);
    const url = `${environment.Auth_Mezon}`;
    window.location.href = url;
  }
}
