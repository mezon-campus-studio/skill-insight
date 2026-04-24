import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrls: [
    '../../../assets/form.css',
    './login.css'
  ],

})
export class Login {
  user = {
    email: '',
    password: ''
  };

  onSubmit(form: any) {
  }
}
