import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionReview } from './question-review';

describe('QuestionReview', () => {
  let component: QuestionReview;
  let fixture: ComponentFixture<QuestionReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
