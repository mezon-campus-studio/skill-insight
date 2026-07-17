import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  TopicService
} from '../../../../services/topic.service';

import {
  SubjectService
} from '../../../../services/subject.service';

@Component({
  selector: 'app-edit-topic',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './edit-topic.html',

  styleUrls: ['./edit-topic.css']
})

export class EditTopic
implements OnInit {

  loading = false;

  topicId = 0;

  subjects: any[] = [];

  formData = {

    topic_name: '',

    description: '',

    subject_id: ''

  };

  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private topicService:
      TopicService,

    private subjectService:
      SubjectService

  ) {}

  ngOnInit(): void {

    this.topicId = Number(

      this.route.snapshot.paramMap.get('id')

    );

    this.loadSubjects();

    this.loadTopicDetail();

  }

  // =========================
  // LOAD SUBJECTS
  // =========================

  loadSubjects(): void {

    this.subjectService
      .getAll(1, 9999)
      .subscribe({

        next: (res: any) => {

          this.subjects =
            res?.subjects || [];

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  // =========================
  // LOAD DETAIL
  // =========================

  loadTopicDetail(): void {

    this.loading = true;

    this.topicService
      .getTopicById(this.topicId)
      .subscribe({

        next: (res: any) => {

          const topic = res?.topic;

          if (!topic) {

            alert('Không tìm thấy topic');

            this.router.navigate([
              '/dashboard/topics'
            ]);

            return;

          }

          this.formData = {

              topic_name:
                topic.topic_name || '',

              description:
                topic.description || '',

              subject_id:
                String(
                  topic.subject_id || ''
                )

            };

          this.loading = false;

        },

        error: (err: any) => {

          console.error(err);

          this.loading = false;

          alert('Lỗi tải topic');

        }

      });

  }

  // =========================
  // UPDATE
  // =========================

  updateTopic(): void {

    if (
      !this.formData.topic_name.trim()
    ) {

      alert(
        'Vui lòng nhập tên topic'
      );

      return;

    }

    if (
      !this.formData.subject_id
    ) {

      alert(
        'Vui lòng chọn subject'
      );

      return;

    }

    this.loading = true;

    const payload = {

      topic_name:
        this.formData.topic_name,

      description:
        this.formData.description,

      subject_id:
        Number(
          this.formData.subject_id
        )

    };

    this.topicService
      .updateTopic(
        this.topicId,
        payload
      )
      .subscribe({

        next: () => {

          this.loading = false;

          alert(
            'Cập nhật topic thành công'
          );

          this.router.navigate([
            '/dashboard/topics'
          ]);

        },

        error: (err: any) => {

          console.error(err);

          this.loading = false;

          alert(

            err?.error?.message ||

            'Cập nhật thất bại'

          );

        }

      });

  }

}