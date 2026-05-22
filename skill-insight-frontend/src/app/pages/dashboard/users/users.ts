// import {
//   Component,
//   OnInit
// } from '@angular/core';

// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpErrorResponse } from '@angular/common/http';
// import { Router } from '@angular/router';

// import { UserService } from '../../../services/user.service';

// @Component({
//   selector: 'app-users',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule
//   ],
//   templateUrl: './users.html',
//   styleUrls: ['./users.css']
// })
// export class UsersComponent implements OnInit {

//   users: any[] = [];

//   currentPage = 1;
//   totalPages = 1;
//   limit = 5;

//   loading = false;

//   savingMap: { [key: number]: boolean } = {};

//   searchKeyword: string = '';

//   newUser = {
//     full_name: '',
//     email: '',
//     password: '',
//     role: 'student'
//   };

//   creating = false;

//   constructor(
//     private userService: UserService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadUsers(1);
//   }

//   loadUsers(page: number = 1): void {

//     this.loading = true;

//     this.userService
//       .getUsers(page, this.limit, this.searchKeyword)
//       .subscribe({
//         next: (res: any) => {

//           console.log("📦 USERS RESPONSE:", res);

//           const data = res?.data || {};

//           this.users = data.users || [];

//           this.currentPage =
//             data.pagination?.currentPage || 1;

//           this.totalPages =
//             data.pagination?.totalPages || 1;

//           this.loading = false;
//         },

//         error: (err: HttpErrorResponse) => {
//           console.error('LOAD USERS ERROR:', err);

//           this.loading = false;
//           this.users = [];

//           if (err.status === 401) {
//             this.router.navigate(['/login']);
//           }
//         }
//       });
//   }

//   onSearch(): void {
//     this.loadUsers(1);
//   }

//   changePage(page: number): void {
//     if (
//       page < 1 ||
//       page > this.totalPages ||
//       page === this.currentPage
//     ) return;

//     this.loadUsers(page);
//   }

//   nextPage(): void {
//     this.changePage(this.currentPage + 1);
//   }

//   prevPage(): void {
//     this.changePage(this.currentPage - 1);
//   }

//   createUser(): void {

//     if (this.creating) return;

//     if (
//       !this.newUser.full_name ||
//       !this.newUser.email ||
//       !this.newUser.password
//     ) {
//       alert('Vui lòng nhập đầy đủ thông tin');
//       return;
//     }

//     this.creating = true;

//     this.userService
//       .createUser(this.newUser)
//       .subscribe({
//         next: () => {

//           alert('Tạo user thành công');

//           this.newUser = {
//             full_name: '',
//             email: '',
//             password: '',
//             role: 'student'
//           };

//           this.loadUsers(1);

//           this.creating = false;
//         },

//         error: (err: HttpErrorResponse) => {
//           console.error('CREATE USER ERROR:', err);

//           alert(err.error?.message || 'Tạo user thất bại');

//           this.creating = false;
//         }
//       });
//   }

//   saveRole(user: any): void {

//     const id = user.user_id;

//     if (this.savingMap[id]) return;

//     this.savingMap[id] = true;

//     this.userService
//       .updateRole(id, user.role)
//       .subscribe({
//         next: () => {
//           alert('Cập nhật quyền thành công');

//           this.loadUsers(this.currentPage);

//           this.savingMap[id] = false;
//         },

//         error: (err: HttpErrorResponse) => {
//           console.error('UPDATE ROLE ERROR:', err);

//           alert(err.error?.message || 'Lỗi cập nhật quyền');

//           this.savingMap[id] = false;
//         }
//       });
//   }

//   deleteUser(user: any): void {

//     const id = user.user_id;

//     const confirmDelete = confirm(
//       `Bạn có chắc muốn xóa user "${user.full_name}"?`
//     );

//     if (!confirmDelete) return;

//     this.userService
//       .deleteUser(id)
//       .subscribe({
//         next: () => {
//           alert('Xóa user thành công');

//           this.loadUsers(this.currentPage);
//         },

//         error: (err: HttpErrorResponse) => {
//           console.error('DELETE USER ERROR:', err);

//           alert(err.error?.message || 'Xóa user thất bại');
//         }
//       });
//   }

//   // ======================
//   // HELPER
//   // ======================
//   isSaving(userId: number): boolean {
//     return !!this.savingMap[userId];
//   }

//   get pages(): number[] {
//     return Array.from(
//       { length: this.totalPages },
//       (_, i) => i + 1
//     );
//   }
// }





import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs'; 
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; // Thêm cái này

import { UserService } from '@services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {

   private searchSubject = new Subject<string>();

    selectedUser = signal<any>(null);
    showDetailPopup = signal<boolean>(false);

    showConfirmPopup = signal<boolean>(false);
    showMaintenancePopup = signal<boolean>(false);
    confirmAction: 'DELETE' | 'RESTORE' | 'HARD_DELETE' = 'DELETE'; 
    userInAction = signal<any>(null);

  // --- 1. Dữ liệu & Danh sách ---
  users: any[] = [];
  
  // --- 2. Phân trang & Bộ lọc ---
  currentPage = 1;
  totalPages = 1;
  limit = 10;
  searchKeyword: string = '';
  activeTab: 'ALL' | 'admin' | 'teacher' | 'student' | 'DELETED' = 'ALL';

  // --- 3. Thống kê (Dùng để hiển thị lên 4 Card ở đầu trang) ---
  stats = {
    total: 0,
    admin: 0,
    teacher: 0,
    student: 0
  };

  // --- 4. Trạng thái giao diện (UI States) ---
  loading = false;       // Hiệu ứng loading khi tải bảng
  isGranting = false;    // Trạng thái chờ khi bấm "Cấp quyền"
  savingMap: { [key: number]: boolean } = {}; // Theo dõi việc đang lưu Role từng dòng

  // --- 5. Model cho tính năng Cấp tài khoản nhanh ---
  quickGrant = {
    email: '',
    role: 'student'
  };
  
  constructor(
    private userService: UserService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers(1);

     this.searchSubject.pipe(
      debounceTime(500),         // Đợi 500ms sau khi người dùng ngừng gõ
      distinctUntilChanged()     // Chỉ gọi API nếu nội dung gõ khác lần trước
    ).subscribe(keyword => {
      this.searchKeyword = keyword;
      this.loadUsers(1);         // Tự động load trang 1
    });
  }
  
  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value); // Đẩy giá trị vào luồng xử lý
  }

  onSearch(): void {
    this.loadUsers(1);
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  openConfirm(user: any, action: 'DELETE' | 'RESTORE' | 'HARD_DELETE') {
    this.userInAction.set(user);
    this.confirmAction = action;
    this.showConfirmPopup.set(true);
  }

  onComingSoon() {
    this.showMaintenancePopup.set(true);
  }
  /**
   * Chuyển đổi Tab để lọc danh sách theo vai trò
   * @param tab: 'ALL' | 'admin' | 'teacher' | 'student'
   */
  setTab(tab: 'ALL' | 'admin' | 'teacher' | 'student' | 'DELETED'): void {
    this.activeTab = tab;
    this.currentPage = 1; // Luôn quay về trang đầu khi đổi bộ lọc
    this.loadUsers(1); 
  }

  /**
   * Gọi API lấy danh sách người dùng và thống kê số lượng
   */
  loadUsers(page: number = 1): void {
    this.loading = true;
    this.currentPage = page;

    // Backend Prisma yêu cầu Role viết hoa, Tab 'ALL' gửi chuỗi rỗng để không lọc
    // const filterRole = this.activeTab === 'ALL' ? '' : this.activeTab;
     const filterRole =
  this.activeTab === 'ALL'
    ? ''
    : this.activeTab === 'DELETED'
    ? 'DELETED'
    : this.activeTab.toLowerCase();

    this.userService
      .getUsers(page, this.limit, this.searchKeyword, filterRole)
      .subscribe({
        next: (res: any) => {
          // Hỗ trợ format dữ liệu { data: { users: [], stats: {} } }
          const responseData = res?.data || res;
          
          this.users = responseData.users || [];
          this.currentPage = responseData.pagination?.currentPage || page;
          this.totalPages = responseData.pagination?.totalPages || 1;
          
          // Gán dữ liệu vào 4 card thống kê trên giao diện
          if (responseData.stats) {
            this.stats = responseData.stats;
          }

          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('❌ [Load Users] Error:', err);
          this.loading = false;
          this.users = [];
          
          // Nếu hết hạn token (401), đẩy về trang login
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
  }

  onQuickGrant(): void {
    const email = this.quickGrant.email.trim().toLowerCase();
    
    if (!email || this.isGranting) {
      alert('Vui lòng nhập Email hợp lệ!');
      return;
    }

    this.isGranting = true;
    
    const payload = {
      full_name: email.split('@')[0], // Lấy phần trước @ làm tên (Vd: vuvuong535)
      email: email,
      password: 'User@123456',       // Mật khẩu mặc định hệ thống cấp
      role: this.quickGrant.role      // Role chọn từ dropdown
    };

    this.userService.createUser(payload).subscribe({
      next: () => {
        alert(`✅ Đã cấp quyền ${this.quickGrant.role} thành công cho ${email}`);
        this.quickGrant.email = '';  // Xóa ô nhập sau khi xong
        this.loadUsers(1);           // Tải lại để cập nhật danh sách & stats
        this.isGranting = false;
      },
      error: (err: HttpErrorResponse) => {
        alert(err.error?.message || '❌ Lỗi: Email đã tồn tại hoặc dữ liệu không hợp lệ.');
        this.isGranting = false;
      }
    });
  }

  /**
   * Thay đổi quyền (Role) trực tiếp trên dòng
   */
  updateRole(user: any, newRole: string): void {
    const id = user.user_id;
    if (this.savingMap[id]) return;

    this.savingMap[id] = true;
    
    this.userService.updateRole(id, newRole).subscribe({
      next: () => {
        user.role = newRole; // Cập nhật giao diện ngay
        this.savingMap[id] = false;
        this.loadUsers(this.currentPage); // Tải lại để cập nhật số lượng ở các Card Stats
      },
      error: (err: HttpErrorResponse) => {
        alert('❌ Không thể cập nhật: ' + (err.error?.message || 'Lỗi server'));
        this.savingMap[id] = false;
        this.loadUsers(this.currentPage); // Hoàn tác về giá trị cũ
      }
    });
  }

  /**
   * Xem hồ sơ chi tiết người dùng (Truy cập thông tin cá nhân)
   */
  viewUserDetails(user: any): void {
    this.userService.getUserById(user.user_id).subscribe({
      next: (res: any) => {
        this.selectedUser.set(res.data); 
        this.showDetailPopup.set(true); 
      },
      error: (err) => {
        console.error(err);
        alert('Lỗi: ' + (err.error?.message || 'Không thể lấy thông tin.'));
      }
    });
  }

  closeDetail(): void {
    this.showDetailPopup.set(false);
    this.selectedUser.set(null);
  }


  deleteUser(user: any): void {
    if (!confirm(`⚠️ CẢNH BÁO!\nBạn có chắc chắn muốn xóa vĩnh viễn tài khoản: ${user.email}?\nDữ liệu đã xóa không thể khôi phục.`)) {
      return;
    }

    this.userService.deleteUser(user.user_id).subscribe({
      next: () => {
        alert('🗑️ Đã xóa thành công');
        this.loadUsers(this.currentPage);
      },
      error: (err: HttpErrorResponse) => {
        alert('❌ Xóa thất bại: ' + (err.error?.message || 'Bạn không có quyền này.'));
      }
    });
  }

  executeAction() {

  const user = this.userInAction();

  if (!user) return;

  let request$: any;

  const action = this.confirmAction;

  // Đóng / mở tài khoản
  if (action === 'DELETE' || action === 'RESTORE') {

    request$ = this.userService.toggleStatus(
      user.user_id
    );

  }

  // Xóa vĩnh viễn
  else if (action === 'HARD_DELETE') {

    request$ = this.userService.permanentlyDelete(
      user.user_id
    );

  }

  // fallback
  else {

    return;
  }

  request$.subscribe({

    next: () => {

      this.showConfirmPopup.set(false);

      this.loadUsers(this.currentPage);

      // cập nhật popup detail nếu đang mở
      this.userService.getUserById(user.user_id).subscribe({

        next: (res: any) => {

          this.selectedUser.set(
            res.data || res.user || res
          );
        },

        error: () => {}
      });

    },

    error: (err: any) => {

      console.error(err);

      this.showConfirmPopup.set(false);

      alert(
        err.error?.message || 'Thao tác thất bại'
      );
    }
  });
}

permanentlyDelete(user: any): void {

    if (!user) return;

    const confirmDelete = confirm(
      `⚠️ Xóa vĩnh viễn ${user.full_name}?\nKhông thể khôi phục dữ liệu.`
    );

    if (!confirmDelete) return;

    this.userService.permanentlyDelete(user.user_id).subscribe({

      next: () => {

        alert('🗑️ Đã xóa vĩnh viễn');

        this.showDetailPopup.set(false);

        this.loadUsers(this.currentPage);
      },

      error: (err: any) => {

        console.error(err);

        alert(
          err.error?.message || '❌ Không thể xóa vĩnh viễn'
        );
      }
    });
  } 

  resetUserPassword(user: any) {
    const newPass = 'Skill@123456'; // Mật khẩu mặc định
    if (confirm(`Bạn có chắc muốn cấp lại mật khẩu mặc định "${newPass}" cho ${user.full_name}?`)) {
      
      // Gọi API đặt mật khẩu (Hàm này bạn đã có trong UserService rồi)
      this.userService.setUserPassword(user.user_id, newPass).subscribe({
        next: () => {
          alert('✅ Đã cấp lại mật khẩu thành công!');
          this.loadUsers(this.currentPage); // Tải lại danh sách để cập nhật trạng thái "Đã có pass"
        },
        error: (err) => alert('❌ Lỗi: ' + (err.error?.message || 'Không thể đặt lại mật khẩu'))
      });
    }
  }

    toggleUserStatus(user: any) {
  // 1. Kiểm tra nếu tài khoản đang ở trong Thùng rác (DELETED) thì không dùng hàm này
  if (this.activeTab === 'DELETED') {
    this.openConfirm(user, 'RESTORE');
    return;
  }

  // 2. Kiểm tra logic status (Mặc định là true nếu là null/undefined)
  const currentStatus = user.status !== false; 
  const action = currentStatus ? 'khóa' : 'mở khóa';

  if (!confirm(`Bạn có chắc muốn ${action} tài khoản ${user.full_name}?`)) {
    return;
  }

  // 🔥 SỬA TẠI ĐÂY: Chỉ truyền 1 tham số user_id
  this.userService.toggleStatus(user.user_id).subscribe({
    next: () => {
      alert(`Đã ${action} tài khoản thành công!`);
      this.loadUsers(this.currentPage); // Tải lại để cập nhật UI
    },
    error: (err: any) => {
      console.error(err);
      alert(err.error?.message || 'Không thể cập nhật trạng thái');
    }
  });
}

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadUsers(page);
    }
  }

  get pages(): number[] {
    const total = this.totalPages || 1;
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}
