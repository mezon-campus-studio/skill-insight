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
  Router,
  RouterModule
} from '@angular/router';

import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  firstValueFrom
} from 'rxjs';

import * as XLSX from 'xlsx';

import {
  TopicService
} from '../../../../services/topic.service';

import {
  SubjectService
} from '../../../../services/subject.service';

@Component({
  selector: 'app-create-topic',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './create-topic.html',

  styleUrls: ['./create-topic.css']
})

export class CreateTopic
implements OnInit {

  // =====================================
  // STATE
  // =====================================

  loading = false;

  subjects: any[] = [];

  selectedFileName = '';

  successCount = 0;

  failCount = 0;

  totalRowsCount = 0;

  // =====================================
  // SEARCH
  // =====================================

  search = '';

  private searchSubject$ =
    new Subject<string>();

  // =====================================
  // PAGINATION
  // =====================================

  page = 1;

  limit = 20;

  selectedSubject: any = null;

  showDropdown = false;

  formData = {

    topic_name: '',

    description: '',

    subject_id: null as number | null
  };

  constructor(

    private topicService:
      TopicService,

    private subjectService:
      SubjectService,

    private router: Router

  ) {}

  // =====================================
  // INIT
  // =====================================

  ngOnInit(): void {

    this.loadSubjects();

    this.searchSubject$
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((keyword) => {

        this.loadSubjects(keyword);

      });
  }

  // =====================================
  // SEARCH
  // =====================================

  onSearch(): void {

    this.showDropdown = true;

    this.page = 1;

    this.searchSubject$.next(
      this.search
    );
  }

  // =====================================
  // LOAD SUBJECTS
  // =====================================

  loadSubjects(
    search: string = ''
  ): void {

    this.subjectService

      .getAll(
        this.page,
        this.limit,
        search
      )

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

  // =====================================
  // SELECT SUBJECT
  // =====================================

  selectSubject(
    subject: any
  ): void {

    this.selectedSubject = subject;

    this.formData.subject_id =
      Number(subject.subject_id);

    this.search =
      subject.subject_name;

    this.showDropdown = false;
  }

  // =====================================
  // CREATE TOPIC MANUAL
  // =====================================

  async createTopic(): Promise<void> {

    if (

      !this.formData.topic_name ||

      !this.formData.subject_id

    ) {

      alert(
        'Vui lòng nhập đầy đủ thông tin'
      );

      return;
    }

    this.loading = true;

    try {

      // LOAD ALL TOPICS
      const topicRes: any =
        await firstValueFrom(
          this.topicService
            .getAllTopics()
        );

      const topics =
        topicRes?.topics || [];

      // CHECK DUPLICATE
      const isDuplicate =
        topics.some((t: any) =>

          t.topic_name
            ?.trim()
            .toLowerCase() ===
          this.formData.topic_name
            .trim()
            .toLowerCase()

          &&

          Number(
            t.subject_id
          ) ===
          Number(
            this.formData.subject_id
          )
        );

      if (isDuplicate) {

        alert(
          'Topic đã tồn tại trong môn học này'
        );

        this.loading = false;

        return;
      }

      // CREATE
      await firstValueFrom(

        this.topicService
          .createTopic({

            ...this.formData,

            subject_id:
              Number(
                this.formData.subject_id
              )
          })
      );

      this.loading = false;

      alert(
        'Tạo topic thành công'
      );

      this.router.navigate([
        '/dashboard/topics'
      ]);

    } catch (err: any) {

      console.error(err);

      this.loading = false;

      alert(
        err?.error?.message ||
        'Có lỗi xảy ra'
      );
    }
  }

  // =====================================
  // IMPORT XLSX / CSV
  // =====================================

  onFileChange(
    event: any
  ): void {

    const target =
      event.target as HTMLInputElement;

    if (
      !target.files ||
      target.files.length !== 1
    ) {

      alert(
        'Vui lòng chọn 1 file'
      );

      return;
    }

    const file =
      target.files[0];

    this.selectedFileName =
      file.name;

    const extension =
      file.name
        .split('.')
        .pop()
        ?.toLowerCase();

    if (
      extension !== 'xlsx' &&
      extension !== 'csv'
    ) {

      alert(
        'Chỉ hỗ trợ file .xlsx hoặc .csv'
      );

      return;
    }

    this.loading = true;

    const reader =
      new FileReader();

    reader.onload =
      async (e: any) => {

        try {

          let workbook:
            XLSX.WorkBook;

          // CSV
          if (
            extension === 'csv'
          ) {

            const dataArray =
              new Uint8Array(
                e.target.result as ArrayBuffer
              );

            const decoder =
              new TextDecoder(
                'utf-8'
              );

            const csvText =
              decoder.decode(
                dataArray
              );

            workbook =
              XLSX.read(
                csvText,
                {
                  type: 'string'
                }
              );

          } else {

            // XLSX
            const dataArray =
              new Uint8Array(
                e.target.result as ArrayBuffer
              );

            workbook =
              XLSX.read(
                dataArray,
                {
                  type: 'array'
                }
              );
          }

          const sheetName =
            workbook.SheetNames[0];

          const worksheet =
            workbook.Sheets[
              sheetName
            ];

          const rawData: any[][] =
            XLSX.utils.sheet_to_json(
              worksheet,
              {
                header: 1
              }
            ) as any[][];

          if (
            rawData.length < 2
          ) {

            alert(
              'File không có dữ liệu'
            );

            this.loading = false;

            return;
          }

          const headers =
            rawData[0].map(
              h =>
                h?.toString()
                  .trim()
                  .toLowerCase() || ''
            );

          const formattedRows:
            any[] = [];

          for (
            let i = 1;
            i < rawData.length;
            i++
          ) {

            const rowData =
              rawData[i];

            if (
              !rowData ||
              rowData.length === 0
            ) continue;

            const rowObj: any =
              {};

            headers.forEach(
              (
                header,
                index
              ) => {

                rowObj[
                  header
                ] =
                  rowData[index];
              }
            );

            formattedRows.push(
              rowObj
            );
          }

          await this.processImportData(
            formattedRows
          );

        } catch (err) {

          console.error(err);

          this.loading = false;

          alert(
            'Không thể đọc file'
          );
        }
      };

    reader.readAsArrayBuffer(
      file
    );

    target.value = '';
  }

  // =====================================
  // PROCESS IMPORT
  // =====================================

  private async processImportData(
    rows: any[]
  ): Promise<void> {

    try {

      this.totalRowsCount =
        rows.length;

      this.successCount = 0;

      this.failCount = 0;

      // LOAD SUBJECTS
      const subjectRes: any =
        await firstValueFrom(
          this.subjectService
            .getAllSubjects()
        );

      const currentSubjects =
        Array.isArray(subjectRes)
          ? subjectRes
          : (
              subjectRes
                ?.subjects || []
            );

      // LOAD TOPICS
      const topicRes: any =
        await firstValueFrom(
          this.topicService
            .getAllTopics()
        );

      const currentTopics =
        topicRes?.topics || [];

      // =====================================
      // LOOP
      // =====================================

      for (const row of rows) {

        const subjectName =
          row['subject_name']
            ?.toString()
            .trim();

        const topicName =
          row['topic_name']
            ?.toString()
            .trim();

        const description =
          row['description']
            ?.toString()
            .trim() || '';

        if (
          !subjectName ||
          !topicName
        ) {

          this.failCount++;

          continue;
        }

        // =====================================
        // CHECK SUBJECT
        // =====================================

        let subject =
          currentSubjects.find(
            (s: any) =>

              s.subject_name
                ?.trim()
                .toLowerCase()

              ===

              subjectName
                .toLowerCase()
          );

        // CREATE SUBJECT IF NOT EXISTS
        if (!subject) {

          try {

            const newSubject: any =
              await firstValueFrom(

                this.subjectService
                  .add({

                    subject_name:
                      subjectName
                  })
              );

            subject = {
              subject_id:
                newSubject?.subject
                  ?.subject_id,

              subject_name:
                subjectName
            };

            currentSubjects.push(
              subject
            );

          } catch (err) {

            console.error(err);

            this.failCount++;

            continue;
          }
        }

        // =====================================
        // CHECK DUPLICATE TOPIC
        // =====================================

        const isDuplicate =
          currentTopics.some(
            (t: any) =>

              t.topic_name
                ?.trim()
                .toLowerCase()

              ===

              topicName
                .toLowerCase()

              &&

              Number(
                t.subject_id
              ) ===
              Number(
                subject.subject_id
              )
          );

        if (isDuplicate) {

          console.log(
            `TRÙNG: ${topicName}`
          );

          this.failCount++;

          continue;
        }

        // =====================================
        // CREATE TOPIC
        // =====================================

        try {

          await firstValueFrom(

            this.topicService
              .createTopic({

                topic_name:
                  topicName,

                description:
                  description,

                subject_id:
                  Number(
                    subject.subject_id
                  )
              })
          );

          currentTopics.push({

            topic_name:
              topicName,

            subject_id:
              subject.subject_id
          });

          this.successCount++;

        } catch (err) {

          console.error(err);

          this.failCount++;
        }
      }

      this.loading = false;

      alert(

        `Import hoàn tất!\n\n` +

        `Thành công: ${this.successCount}\n` +

        `Trùng/Lỗi: ${this.failCount}`
      );

    } catch (err) {

      console.error(err);

      this.loading = false;

      alert(
        'Import thất bại'
      );
    }
  }
}