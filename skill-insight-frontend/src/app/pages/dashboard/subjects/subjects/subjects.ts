// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { SubjectService } from '../../../../services/subject.service';
// import { AuthService } from '../../../../services/auth.service';
// import * as XLSX from 'xlsx';

// @Component({
//   selector: 'app-subject',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './subjects.html',
//   styleUrl: './subjects.css',

  
// })

// export class Subject implements OnInit {

//   // =========================
//   // UI
//   // =========================
//   view: 'list' | 'add' | 'update' | 'bulk' = 'list';
//   loading = false;
//   user: any;

//   // =========================
//   // DATA
//   // =========================
//   subjects: any[] = [];
//   currentPage = 1;
//   totalPages = 1;
//   totalItems = 0;
//   limit = 5;

//   // =========================
//   // POPUP DELETE
//   // =========================
//   showDeletePopup = false;
//   deleteId: number | null = null;

//   showBulkPopup = false;
//   bulkAction: 'selected' | 'all' | null = null;

//   searchText = '';
//   fromDate = '';
//   toDate = '';
//   dateMode = '';

//   // =========================
//   // TOAST
//   // =========================
//   toast = {
//     show: false,
//     message: '',
//     type: 'success' as 'success' | 'error'
//   };

//   onSearchChange() {
//     this.currentPage = 1;
//     this.loadSubjects();
//   }

//   get selectedCount(): number {
//     return this.selectedIds.size;
//   }

//   get filteredSubjects() {
//     return this.subjects.filter(s => {

//       // NAME
//       const matchName =
//         s.subject_name
//           .toLowerCase()
//           .includes(this.searchText.toLowerCase());

//       const created = new Date(s.created_at);

//       // MODE FILTER
//       let matchDate = true;

//       if (this.dateMode === 'today') {
//         const today = new Date();
//         matchDate =
//           created.toDateString() === today.toDateString();
//       }

//       if (this.dateMode === '7days') {
//         const now = new Date();
//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(now.getDate() - 7);

//         matchDate =
//           created >= sevenDaysAgo && created <= now;
//       }

//       // CUSTOM RANGE (chỉ áp dụng nếu user nhập)
//       if (this.fromDate) {
//         matchDate = matchDate && created >= new Date(this.fromDate);
//       }

//       if (this.toDate) {
//         matchDate = matchDate && created <= new Date(this.toDate);
//       }

//       return matchName && matchDate;
//     });
//   }

//   resetFilter() {
//     this.searchText = '';
//     this.fromDate = '';
//     this.toDate = '';
//     this.dateMode = '';
//   }

//   showToast(message: string, type: 'success' | 'error' = 'success') {
//     this.toast = { show: true, message, type };

//     setTimeout(() => {
//       this.toast.show = false;
//     }, 2500);
//   }

//   // =========================
//   // SELECT MULTI
//   // =========================
//   selectedIds = new Set<number>();

//   // =========================
//   // FORM
//   // =========================
//   newSubject = {
//     subject_name: '',
//     description: ''
//   };

//   bulkSubjects: any[] = [];

//   updateSubjectData = {
//     id: null as number | null,
//     subject_name: '',
//     description: ''
//   };

//   constructor(
//     private subjectService: SubjectService,
//     private authService: AuthService
//   ) {}

//   // =====================================================
//   // INIT
//   // =====================================================
//   ngOnInit(): void {
//     this.user = this.authService.getUser();
//     this.loadSubjects(1);
//   }

//   // =====================================================
//   // LOAD
//   // =====================================================
//  loadSubjects(page: number = 1) {

//   this.loading = true;
//   this.currentPage = page;

//   this.subjectService
//     .getAll(page, this.limit, this.searchText)
//     .subscribe({

//       next: (res: any) => {

//         this.subjects = res.subjects || [];
//         this.totalPages = res.pagination?.totalPages || 1;
//         this.totalItems = res.pagination?.totalItems || 0;

//         this.selectedIds.clear();

//         this.loading = false;
//       },

//       error: (err) => {

//         console.error(err);

//         this.loading = false;

//         this.showToast('Lỗi tải dữ liệu', 'error');

//       }

//     });

// }

//   showList() {
//     this.view = 'list';
//     this.loadSubjects(this.currentPage);
//   }

//   // =====================================================
//   // CHECK DUPLICATE
//   // =====================================================
//   isDuplicateSubject(name: string): boolean {
//     const lower = name.trim().toLowerCase();
//     return this.subjects.some(
//       s => s.subject_name.trim().toLowerCase() === lower
//     );
//   }

//   // =====================================================
//   // ADD
//   // =====================================================
//   addSubject() {

//     if (!this.newSubject.subject_name.trim()) {
//       this.showToast('Tên môn học không được để trống', 'error');
//       return;
//     }

//     if (this.isDuplicateSubject(this.newSubject.subject_name)) {
//       this.showToast('Môn học đã tồn tại', 'error');
//       return;
//     }

//     this.subjectService.add(this.newSubject).subscribe({

//       next: () => {
//         this.showToast('Thêm môn học thành công');
//         this.newSubject = { subject_name: '', description: '' };
//         this.showList();
//       },

//       error: (err) => {
//         console.error(err);
//         this.showToast(err.error?.message || 'Lỗi thêm dữ liệu', 'error');
//       }

//     });
//   }

//   // =====================================================
//   // UPDATE
//   // =====================================================
//   startUpdate(subject: any) {
//     this.view = 'update';

//     this.updateSubjectData = {
//       id: subject.subject_id,
//       subject_name: subject.subject_name,
//       description: subject.description
//     };
//   }

//   updateSubject() {

//     if (!this.updateSubjectData.id) return;

//     const duplicated = this.subjects.some(
//       s =>
//         s.subject_id !== this.updateSubjectData.id &&
//         s.subject_name.trim().toLowerCase() ===
//         this.updateSubjectData.subject_name.trim().toLowerCase()
//     );

//     if (duplicated) {
//       this.showToast('Môn học đã tồn tại', 'error');
//       return;
//     }

//     this.subjectService.update(
//       this.updateSubjectData.id,
//       {
//         subject_name: this.updateSubjectData.subject_name,
//         description: this.updateSubjectData.description
//       }
//     ).subscribe({

//       next: () => {
//         this.showToast('Cập nhật thành công');
//         this.showList();
//       },

//       error: (err) => {
//         console.error(err);
//         this.showToast(err.error?.message || 'Lỗi cập nhật', 'error');
//       }

//     });
//   }

//   // =====================================================
//   // DELETE ONE
//   // =====================================================
//   deleteSubject(id: number) {

//     const ok = confirm('Xóa môn học này?');
//     if (!ok) return;

//     this.subjectService.delete(id).subscribe({

//       next: () => {
//         this.showToast('Xóa thành công');
//         this.loadSubjects(this.currentPage);
//       },

//       error: (err) => {
//         console.error(err);
//         this.showToast(err.error?.message || 'Lỗi xóa', 'error');
//       }

//     });
//   }

//   // =====================================================
//   // DELETE MULTI
//   // =====================================================
//   deleteSelected() {

//     const ids = Array.from(this.selectedIds);

//     if (!ids.length) {
//       this.showToast('Chưa chọn dữ liệu', 'error');
//       return;
//     }

//     const ok = confirm(`Xóa ${ids.length} môn học?`);
//     if (!ok) return;

//     this.subjectService.deleteMultiple(ids).subscribe({

//       next: () => {
//         this.showToast('Xóa danh sách thành công');
//         this.selectedIds.clear();
//         this.loadSubjects(this.currentPage);
//       },

//       error: (err) => {
//         console.error(err);
//         this.showToast(err.error?.message || 'Lỗi xóa', 'error');
//       }

//     });
//   }

//   // =====================================================
//   // DELETE ALL
//   // =====================================================
//   deleteAllSubjects() {

//     const ok = confirm('Xóa toàn bộ môn học?');
//     if (!ok) return;

//     this.subjectService.deleteAll().subscribe({

//       next: () => {
//         this.showToast('Đã xóa toàn bộ môn học');
//         this.loadSubjects(1);
//         this.selectedIds.clear();
//       },

//       error: (err) => {
//         console.error(err);
//         this.showToast('Lỗi xóa toàn bộ', 'error');
//       }

//     });
//   }

//   // =====================================================
//   // SELECT
//   // =====================================================
//   toggleSelect(id: any) {
//     const numId = Number(id);

//     const newSet = new Set<number>(this.selectedIds);

//     if (newSet.has(numId)) {
//       newSet.delete(numId);
//     } else {
//       newSet.add(numId);
//     }

//     this.selectedIds = newSet;
//   }

//   toggleSelectAll(event: any) {
//     const checked = event.target.checked;

//     if (checked) {
//       this.selectedIds = new Set(
//         this.subjects.map(s => Number(s.subject_id))
//       );
//     } else {
//       this.selectedIds = new Set<number>();
//     }
//   }
//   // =====================================================
//   // BULK
//   // =====================================================
//   showBulkAdd() {
//     this.view = 'bulk';
//     this.bulkSubjects = [{ subject_name: '', description: '' }];
//   }

//   addMoreRow() {
//     this.bulkSubjects.push({ subject_name: '', description: '' });
//   }

//   removeRow(i: number) {
//     if (this.bulkSubjects.length > 1)
//       this.bulkSubjects.splice(i, 1);
//   }

//   saveBulk(): void {

//   const cleanData = this.bulkSubjects

//     .map((s: any) => ({

//       subject_name: s.subject_name?.trim(),

//       description: s.description?.trim()

//     }))

//     .filter((s: any) => s.subject_name);

//   if (cleanData.length === 0) {

//     this.showToast('Không có dữ liệu hợp lệ', 'error');

//     return;

//   }

//   this.subjectService.addBulk(cleanData).subscribe({

//     next: () => {

//       this.showToast(
//         `Đã nhập ${cleanData.length} môn học`,
//         'success'
//       );

//       this.bulkSubjects = [];

//       this.view = 'list';

//       this.loadSubjects();

//     },

//     error: (err) => {

//       console.error(err);

//       this.showToast('Import thất bại', 'error');

//     }

//   });

// }

//   // =====================================================
//   // POPUP DELETE UI
//   // =====================================================
//   openDeletePopup(id: number) {
//     this.deleteId = id;
//     this.showDeletePopup = true;
//   }

//   confirmDelete() {

//     if (!this.deleteId) return;

//     this.subjectService.delete(this.deleteId).subscribe({

//       next: () => {
//         this.showToast('Xóa thành công');
//         this.loadSubjects(this.currentPage);
//         this.closePopup();
//       },

//       error: (err) => {
//         console.error(err);
//         this.showToast('Lỗi xóa', 'error');
//       }

//     });
//   }

//   closePopup() {
//     this.showDeletePopup = false;
//     this.deleteId = null;
//   }

//   // =====================================================
//   // IMPORT EXCEL
//   // =====================================================
//   onFileChange(event: any): void {

//   const target: DataTransfer = <DataTransfer>(event.target);

//   if (target.files.length !== 1) {

//     this.showToast('Chỉ chọn 1 file', 'error');

//     return;

//   }

//   const file = target.files[0];

//   const fileName = file.name.toLowerCase();

//   const reader: FileReader = new FileReader();

//   // CSV
//   if (fileName.endsWith('.csv')) {

//     reader.onload = (e: any) => {

//       const csvText = e.target.result;

//       const workbook = XLSX.read(csvText, {
//         type: 'string'
//       });

//       this.processExcelData(workbook);

//     };

//     reader.readAsText(file, 'UTF-8');

//   }

//   // EXCEL
//   else {

//     reader.onload = (e: any) => {

//       const binaryString: string = e.target.result;

//       const workbook = XLSX.read(binaryString, {
//         type: 'binary'
//       });

//       this.processExcelData(workbook);

//     };

//     reader.readAsBinaryString(file);

//   }

// }

// processExcelData(workbook: XLSX.WorkBook): void {

//   const sheetName = workbook.SheetNames[0];

//   const worksheet = workbook.Sheets[sheetName];

//   const rawData = XLSX.utils.sheet_to_json(worksheet, {
//     raw: false,
//     defval: ''
//   });

//   const formattedData = rawData

//     .map((row: any) => {

//       const subject_name =
//         String(
//           row.subject_name ||
//           row.Subject ||
//           row['Tên môn học'] ||
//           ''
//         )
//         .trim()
//         .normalize('NFC');

//       const description =
//         String(
//           row.description ||
//           row.Description ||
//           row['Mô tả'] ||
//           ''
//         )
//         .trim()
//         .normalize('NFC');

//       return {
//         subject_name,
//         description
//       };

//     })

//     .filter((item: any) => item.subject_name)

//     .filter((item: any, index: number, self: any[]) => {

//       return index === self.findIndex(
//         (x: any) =>
//           x.subject_name.toLowerCase() ===
//           item.subject_name.toLowerCase()
//       );

//     });

//   if (formattedData.length === 0) {

//     this.showToast('File không có dữ liệu hợp lệ', 'error');

//     return;

//   }

//   // HIỆN PREVIEW
//   this.bulkSubjects = formattedData;

//   this.view = 'bulk';

// }
//   // =====================================================
//   // EXPORT
//   // =====================================================
//   exportCurrentPage() {

//     const data = this.subjects.map(s => ({
//       ID: s.subject_id,
//       'Tên môn học': s.subject_name,
//       'Mô tả': s.description
//     }));

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(wb, ws, 'Subjects');
//     XLSX.writeFile(wb, `subjects_page_${this.currentPage}.xlsx`);

//     this.showToast('Xuất file thành công');
//   }

//   // =====================================================
//   // PAGINATION
//   // =====================================================
//   get pages(): number[] {
//     return Array.from({ length: this.totalPages }, (_, i) => i + 1);
//   }
// }





import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubjectService } from '../../../../services/subject.service';
import { AuthService } from '../../../../services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css',
})

export class Subject implements OnInit {

  view: 'list' | 'add' | 'update' | 'bulk' = 'list';

  loading = false;

  user: any;

  subjects: any[] = [];

  bulkSubjects: any[] = [];

  currentPage = 1;
  totalPages = 1;
  totalItems = 0;

  limit = 5;

  searchText = '';
  fromDate = '';
  toDate = '';
  dateMode = '';


  selectedIds = new Set<number>();

  showDeletePopup = false;

  deleteId: number | null = null;

  showBulkPopup = false;

  bulkAction: 'selected' | 'all' | null = null;


  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error';
  } = {
    show: false,
    message: '',
    type: 'success'
  };

  newSubject = {
    subject_name: '',
    description: ''
  };

  updateSubjectData = {
    id: null as number | null,
    subject_name: '',
    description: ''
  };

  constructor(
    private subjectService: SubjectService,
    private authService: AuthService
  ) {}


  ngOnInit(): void {

    this.user = this.authService.getUser();

    this.loadSubjects(1);

  }

  showToast(
    message: string,
    type: 'success' | 'error' = 'success'
  ) {

    this.toast = {
      show: true,
      message,
      type
    };

    setTimeout(() => {

      this.toast.show = false;

    }, 2500);

  }


  showList(): void {

    this.view = 'list';

    this.loadSubjects(this.currentPage);

  }

  private normalize(name: string): string {
    return (name || '')
      .trim()
      .toLowerCase()
      .normalize('NFC');
  }

loadSubjects(page: number = 1): void {

  this.loading = true;

  this.currentPage = page;

  this.subjectService
    .getAll(
      page,
      this.limit,
      this.searchText,
      this.dateMode,
      this.fromDate,
      this.toDate
    )
    .subscribe({

      next: (res: any) => {

        this.subjects =
          res.subjects || [];

        this.totalPages =
          res.pagination?.totalPages || 1;

        this.totalItems =
          res.pagination?.totalItems || 0;

        this.selectedIds.clear();

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

        this.showToast(
          'Lỗi tải dữ liệu',
          'error'
        );

      }

    });

}

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadSubjects(1);
  }

    applyFilters(): void {

    this.currentPage = 1;

    this.loadSubjects(1);

  }

  resetFilters(): void {

    this.searchText = '';

    this.fromDate = '';

    this.toDate = '';

    this.dateMode = '';

    this.loadSubjects(1);

  }

  // =========================
  // ADD
  // =========================

  addSubject(): void {

    if (!this.newSubject.subject_name.trim()) {

      this.showToast(
        'Tên môn học không được để trống',
        'error'
      );

      return;

    }

    const duplicated = this.subjects.some(
      s =>
        s.subject_name
          .trim()
          .toLowerCase() ===
        this.newSubject.subject_name
          .trim()
          .toLowerCase()
    );

    if (duplicated) {

      this.showToast(
        'Môn học đã tồn tại',
        'error'
      );

      return;

    }

    this.subjectService
      .add(this.newSubject)
      .subscribe({

        next: () => {

          this.showToast(
            'Thêm môn học thành công'
          );

          this.newSubject = {
            subject_name: '',
            description: ''
          };

          this.showList();

        },

        error: (err) => {

          console.error(err);

          this.showToast(
            err.error?.message ||
            'Lỗi thêm dữ liệu',
            'error'
          );

        }

      });

  }

  // =========================
  // UPDATE
  // =========================

  startUpdate(subject: any): void {

    this.view = 'update';

    this.updateSubjectData = {
      id: subject.subject_id,
      subject_name: subject.subject_name,
      description: subject.description
    };

  }

  updateSubject(): void {

    if (!this.updateSubjectData.id) return;

    const duplicated = this.subjects.some(
      s =>
        s.subject_id !==
          this.updateSubjectData.id &&
        s.subject_name
          .trim()
          .toLowerCase() ===
        this.updateSubjectData.subject_name
          .trim()
          .toLowerCase()
    );

    if (duplicated) {

      this.showToast(
        'Môn học đã tồn tại',
        'error'
      );

      return;

    }

    this.subjectService.update(
      this.updateSubjectData.id,
      {
        subject_name:
          this.updateSubjectData.subject_name,
        description:
          this.updateSubjectData.description
      }
    ).subscribe({

      next: () => {

        this.showToast(
          'Cập nhật thành công'
        );

        this.showList();

      },

      error: (err) => {

        console.error(err);

        this.showToast(
          err.error?.message ||
          'Lỗi cập nhật',
          'error'
        );

      }

    });

  }

  // =========================
  // DELETE ONE
  // =========================

  openDeletePopup(id: number): void {

    this.deleteId = id;

    this.showDeletePopup = true;

  }

  closePopup(): void {

    this.showDeletePopup = false;

    this.deleteId = null;

  }

  confirmDelete(): void {

    if (!this.deleteId) return;

    this.subjectService
      .delete(this.deleteId)
      .subscribe({

        next: () => {

          this.showToast(
            'Xóa thành công'
          );

          this.closePopup();

          this.loadSubjects(this.currentPage);

        },

        error: (err) => {

          console.error(err);

          this.showToast(
            'Lỗi xóa',
            'error'
          );

        }

      });

  }

  // =========================
  // SELECT
  // =========================

  toggleSelect(id: number): void {

    const newSet =
      new Set<number>(this.selectedIds);

    if (newSet.has(id)) {

      newSet.delete(id);

    } else {

      newSet.add(id);

    }

    this.selectedIds = newSet;

  }

  toggleSelectAll(event: any): void {

    const checked = event.target.checked;

    if (checked) {

      this.selectedIds = new Set(
        this.subjects.map(
          s => Number(s.subject_id)
        )
      );

    } else {

      this.selectedIds.clear();

    }

  }

  get selectedCount(): number {

    return this.selectedIds.size;

  }

  // =========================
  // DELETE MULTIPLE
  // =========================

  deleteSelected(): void {

    const ids =
      Array.from(this.selectedIds);

    if (!ids.length) {

      this.showToast(
        'Chưa chọn dữ liệu',
        'error'
      );

      return;

    }

    this.subjectService
      .deleteMultiple(ids)
      .subscribe({

        next: () => {

          this.showToast(
            'Xóa danh sách thành công'
          );

          this.selectedIds.clear();

          this.showBulkPopup = false;

          this.loadSubjects(this.currentPage);

        },

        error: (err) => {

          console.error(err);

          this.showToast(
            'Lỗi xóa',
            'error'
          );

        }

      });

  }

  // =========================
  // DELETE ALL
  // =========================

  deleteAllSubjects(): void {

    this.subjectService
      .deleteAll()
      .subscribe({

        next: () => {

          this.showToast(
            'Đã xóa toàn bộ môn học'
          );

          this.selectedIds.clear();

          this.showBulkPopup = false;

          this.loadSubjects(1);

        },

        error: (err) => {

          console.error(err);

          this.showToast(
            'Lỗi xóa toàn bộ',
            'error'
          );

        }

      });

  }

  // =========================
  // BULK
  // =========================

  showBulkAdd(): void {

    this.view = 'bulk';

    this.bulkSubjects = [
      {
        subject_name: '',
        description: ''
      }
    ];

  }

  addMoreRow(): void {

    this.bulkSubjects.push({
      subject_name: '',
      description: ''
    });

  }

  removeRow(index: number): void {

    if (this.bulkSubjects.length > 1) {

      this.bulkSubjects.splice(index, 1);

    }

  }

  saveBulk(): void {

    const cleanData = this.bulkSubjects
      .map((s: any) => ({
        subject_name: s.subject_name?.trim(),
        description: s.description?.trim()
      }))
      .filter(s => s.subject_name);

    if (!cleanData.length) {
      this.showToast('Không có dữ liệu hợp lệ', 'error');
      return;
    }

    // 🔥 LẤY LIST ĐÃ TỒN TẠI TRONG DB
    const existingNames = new Set(
      this.subjects.map(s =>
        this.normalize(s.subject_name)
      )
    );

    const toInsert: any[] = [];
    const existed: string[] = [];

    cleanData.forEach(item => {
      const key = this.normalize(item.subject_name);

      if (existingNames.has(key)) {
        existed.push(item.subject_name);
      } else {
        toInsert.push(item);
      }
    });

    // ❌ KHÔNG CÓ DATA MỚI
    if (!toInsert.length) {
      this.showToast(
        `Tất cả môn đã tồn tại (${existed.length})`,
        'error'
      );
      return;
    }

    this.subjectService.addBulk(toInsert).subscribe({

      next: () => {

        this.showToast(
          `Đã thêm ${toInsert.length} môn`
        );

        // 🔥 POPUP THÔNG BÁO CHI TIẾT
        if (existed.length) {
          setTimeout(() => {
            this.showToast(
              `Đã tồn tại ${existed.length} môn: ${existed.join(', ')}`,
              'error'
            );
          }, 800);
        }

        this.bulkSubjects = [];
        this.showList();
      },

      error: (err) => {

        console.error(err);

        this.showToast(
          'Import thất bại',
          'error'
        );

      }

    });
  }

  // =========================
  // IMPORT FILE
  // =========================
onFileChange(event: any): void {

  const file: File = event.target?.files?.[0];

  if (!file) {
    this.showToast('Không có file được chọn', 'error');
    return;
  }

  const fileName = file.name.toLowerCase();
  const reader = new FileReader();

  reader.onerror = () => {
    this.showToast('Không thể đọc file', 'error');
  };

  const handleWorkbook = (workbook: XLSX.WorkBook) => {
    this.processExcelData(workbook);
  };

  // =========================
  // CSV FILE
  // =========================
  if (fileName.endsWith('.csv')) {

    reader.onload = (e: any) => {
      const csvText = e.target.result;

      const workbook = XLSX.read(csvText, {
        type: 'string'
      });

      handleWorkbook(workbook);
    };

    reader.readAsText(file, 'UTF-8');
  }

  // =========================
  // EXCEL FILE
  // =========================
  else {

    reader.onload = (e: any) => {
      const binary = e.target.result;

      const workbook = XLSX.read(binary, {
        type: 'binary'
      });

      handleWorkbook(workbook);
    };

    reader.readAsBinaryString(file);
  }
}

  processExcelData(workbook: XLSX.WorkBook): void {

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rawData = XLSX.utils.sheet_to_json(worksheet, {
    raw: false,
    defval: ''
  });

  const formattedData = rawData
    .map((row: any) => ({
      subject_name: String(
        row.subject_name ||
        row.Subject ||
        row['Tên môn học'] ||
        ''
      ).trim(),

      description: String(
        row.description ||
        row.Description ||
        row['Mô tả'] ||
        ''
      ).trim()
    }))
    .filter((x: any) => x.subject_name);

  if (!formattedData.length) {
    this.showToast('File không có dữ liệu hợp lệ', 'error');
    return;
  }

  this.subjectService.addBulk(formattedData)
    .subscribe({
      next: (res: any) => {

        const inserted = res.insertedCount || 0;
        const duplicated = res.duplicatedCount || 0;

        let msg = `Đã thêm ${inserted} môn học`;

        if (duplicated > 0) {
          msg += ` | ${duplicated} môn đã tồn tại`;
        }

        this.showToast(msg, 'success');

        this.bulkSubjects = [];
        this.view = 'list';
        this.loadSubjects();

      },
      error: () => {
        this.showToast('Import thất bại', 'error');
      }
    });
}

  // =========================
  // EXPORT
  // =========================

  exportCurrentPage(): void {

    const data =
      this.subjects.map(s => ({
        ID: s.subject_id,
        'Tên môn học':
          s.subject_name,
        'Mô tả':
          s.description
      }));

    const ws =
      XLSX.utils.json_to_sheet(data);

    const wb =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      'Subjects'
    );

    XLSX.writeFile(
      wb,
      `subjects_page_${this.currentPage}.xlsx`
    );

    this.showToast(
      'Xuất file thành công'
    );

  }

  // =========================
  // PAGINATION
  // =========================

  get pages(): number[] {

    return Array.from(
      {
        length: this.totalPages
      },
      (_, i) => i + 1
    );

  }

  get filteredSubjects(): any[] {

    return this.subjects.filter(s => {

      const matchName =
        s.subject_name
          ?.toLowerCase()
          .includes(this.searchText.toLowerCase()) ?? false;

      const created = s.created_at ? new Date(s.created_at) : null;

      let matchDate = true;

      if (created) {

        if (this.dateMode === 'today') {
          const today = new Date();
          matchDate = created.toDateString() === today.toDateString();
        }

        if (this.dateMode === '7days') {
          const now = new Date();
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);

          matchDate = created >= sevenDaysAgo && created <= now;
        }

        if (this.fromDate) {
          matchDate = matchDate && created >= new Date(this.fromDate);
        }

        if (this.toDate) {
          matchDate = matchDate && created <= new Date(this.toDate);
        }
      }

      return matchName && matchDate;
    });
  }

}

