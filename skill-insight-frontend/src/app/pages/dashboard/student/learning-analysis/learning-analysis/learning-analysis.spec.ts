import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningAnalysis } from './learning-analysis';

describe('LearningAnalysis', () => {
  let component: LearningAnalysis;
  let fixture: ComponentFixture<LearningAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
