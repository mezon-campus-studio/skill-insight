import { Component } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subject.html',
  styleUrl: './subject.css',
})
export class Subject {
  view: string = 'list';
  subjects: any[] = [];

  constructor(private subjectService: SubjectService) {}

  // ===== FORM DATA =====
  newSubject = {
    subject_name: '',
    description: '',
  };

  deleteId: number | null = null;

  updateSubjectData = {
    id: null as number | null,
    subject_name: '',
    description: '',
  };

  // ===== VIEW =====
  showList() {
    this.view = 'list';
    this.loadSubjects();
  }

  showAdd() {
    this.view = 'add';
  }

  showDelete() {
    this.view = 'delete';
  }

  showUpdate() {
    this.view = 'update';
  }

  // ===== API =====
  loadSubjects() {
    this.subjectService.getAll().subscribe((res) => {
      this.subjects = res;
    });
  }

  addSubject() {
    this.subjectService.add(this.newSubject).subscribe(() => {
      this.newSubject = {
        subject_name: '',
        description: '',
      };
      this.showList();
    });
  }

  deleteSubject() {
    if (!this.deleteId) return;

    this.subjectService.delete(this.deleteId).subscribe(() => {
      this.deleteId = null;
      this.showList();
    });
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
}
