import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subject.html',
  styleUrl: './subject.css',
})
export class Subject implements OnInit {
  view: string = 'list';
  subjects: any[] = [];

  user: any;

  constructor(
    private subjectService: SubjectService,
    private authService: AuthService,
  ) {}

  // ===== FORM DATA =====
  newSubject = {
    subject_name: '',
    description: '',
  };

  updateSubjectData = {
    id: null as number | null,
    subject_name: '',
    description: '',
  };

  // ===== INIT =====
  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadSubjects();
  }

  // ===== VIEW =====
  showList() {
    this.view = 'list';
    this.loadSubjects();
  }

  showAdd() {
    this.view = 'add';
  }

  // ===== API =====
  loadSubjects() {
    this.subjectService.getAll().subscribe((res) => {
      this.subjects = res.data || res;
    });
  }

  addSubject() {
    if (!this.newSubject.subject_name) return;

    this.subjectService.add(this.newSubject).subscribe(() => {
      this.newSubject = {
        subject_name: '',
        description: '',
      };
      this.showList();
    });
  }

  startUpdate(subject: any) {
    this.view = 'update';

    this.updateSubjectData = {
      id: subject.subject_id,
      subject_name: subject.subject_name,
      description: subject.description,
    };
  }

  updateSubject() {
    if (!this.updateSubjectData.id) return;

    this.subjectService
      .update(this.updateSubjectData.id, {
        subject_name: this.updateSubjectData.subject_name,
        description: this.updateSubjectData.description,
      })
      .subscribe(() => {
        this.updateSubjectData = {
          id: null,
          subject_name: '',
          description: '',
        };
        this.showList();
      });
  }

  deleteSubject(id: number) {
    if (!confirm('Bạn chắc chắn muốn xóa?')) return;

    this.subjectService.delete(id).subscribe(() => {
      this.loadSubjects();
    });
  }

  // ===== RBAC =====
  canEdit(subject: any): boolean {
    return this.user?.role === 'admin' || subject.created_by === this.user?.user_id;
  }

  canDelete(subject: any): boolean {
    return this.canEdit(subject);
  }
}
