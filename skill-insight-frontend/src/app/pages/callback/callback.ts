import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.html',
})
export class CallbackComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('TOKEN:', token);
    if (token) {
      localStorage.setItem('token', token);
      console.log('Saved:', localStorage.getItem('token'));
      this.router.navigate(['/home']);
    }
  }
}
