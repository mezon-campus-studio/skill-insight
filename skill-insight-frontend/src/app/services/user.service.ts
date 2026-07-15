import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API = environment.api.users;
  
  constructor(private http: HttpClient) {}

  // 1. Lấy danh sách + Lọc + Thống kê
  getUsers(
    page: number = 1,
    limit: number = 10,
    keyword: string = '',
    role: string = ''
  ): Observable<any> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('keyword', keyword.trim())
      .set('t', Date.now().toString());

    if (role && role !== 'ALL' && role !== '') {
      params = params.set('role', role.toLowerCase());
    }

    return this.http.get(this.API, {
      params,
      withCredentials: true
    });
  }

  // 2. Xem chi tiết
  getUserById(userId: number): Observable<any> {
    return this.http.get(
      `${this.API}/${userId}`,
      { withCredentials: true }
    );
  }

  // 3. Tạo user
  createUser(data: any): Observable<any> {
    return this.http.post(
      this.API,
      data,
      { withCredentials: true }
    );
  }

  // 4. Update thông tin
  updateUser(userId: number, data: any): Observable<any> {
    return this.http.put(
      `${this.API}/${userId}`,
      data,
      { withCredentials: true }
    );
  }

  // 5. Update role
  updateRole(userId: number, role: string): Observable<any> {
    return this.http.put(
      `${this.API}/${userId}/role`,
      { role: role.toUpperCase() },
      { withCredentials: true }
    );
  }

  // 6. Reset password
  setUserPassword(userId: number, pass: string): Observable<any> {
    return this.http.put(
      `${this.API}/${userId}/password`,
      { password: pass },
      { withCredentials: true }
    );
  }

  // 7. Xóa cũ
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(
      `${this.API}/${userId}`,
      { withCredentials: true }
    );
  }

   toggleStatus(userId: number): Observable<any> {
    return this.http.put(
      `${this.API}/${userId}/status`,
      {}, // Gửi body rỗng
      { withCredentials: true }
    );
  }

  // Chuyển vào thùng rác
  softDelete(userId: number): Observable<any> {
    return this.http.delete(
      `${this.API}/${userId}`, 
      { withCredentials: true }
    );
  }

  // Khôi phục
  restoreUser(userId: number): Observable<any> {
    return this.http.put(
      `${this.API}/${userId}/restore`,
      {},
      { withCredentials: true }
    );
  }

  // Xóa vĩnh viễn
  permanentlyDelete(userId: number): Observable<any> {
    return this.http.delete(
      `${this.API}/${userId}/permanent`,
      { withCredentials: true }
    );
  }

  // Export CSV/Excel
  exportUsers(role: string = ''): Observable<Blob> {

    let params = new HttpParams();

    if (role && role !== 'ALL') {
      params = params.set('role', role.toUpperCase());
    }

    return this.http.get(
      `${this.API}/export`,
      {
        params,
        responseType: 'blob',
        withCredentials: true
      }
    );
  }

}