import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBatchView } from './question-batch-view';

describe('QuestionBatchView', () => {
  let component: QuestionBatchView;
  let fixture: ComponentFixture<QuestionBatchView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionBatchView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionBatchView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
