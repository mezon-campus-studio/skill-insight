import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.html',
})
export class CallbackComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    localStorage.setItem('access_token', token);

    this.auth.getMe().subscribe({
      next: (res: any) => {
        const user = res?.user;

        if (!user) {
          this.router.navigate(['/login']);
          return;
        }

        this.auth.saveUser(user);

        if (!user.role) {
          this.router.navigate(['/select-role']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
