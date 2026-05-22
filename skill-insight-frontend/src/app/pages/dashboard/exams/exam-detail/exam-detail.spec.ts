import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamDetail } from './exam-detail';

describe('ExamDetail', () => {
  let component: ExamDetail;
  let fixture: ComponentFixture<ExamDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
