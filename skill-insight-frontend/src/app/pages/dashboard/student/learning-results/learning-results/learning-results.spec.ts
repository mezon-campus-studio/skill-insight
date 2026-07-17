import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningResults } from './learning-results';

describe('LearningResults', () => {
  let component: LearningResults;
  let fixture: ComponentFixture<LearningResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
