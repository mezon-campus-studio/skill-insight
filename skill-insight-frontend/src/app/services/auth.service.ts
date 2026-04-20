import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginWithMezon() {
    const state = Math.random().toString(36).substring(2, 13);
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: environment.clientId,
      redirect_uri: environment.redirectUri,
      response_type: 'code',
      scope: 'openid offline',
      state: state,
      prompt: 'login',
    });

    const url = `https://oauth2.mezon.ai/oauth2/auth?${params.toString()}`;
    //alert('AUTHORIZE URL:' + url);
    window.location.href = url;
  }
}
