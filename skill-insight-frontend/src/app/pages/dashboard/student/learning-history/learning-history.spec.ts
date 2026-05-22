import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningHistory } from './learning-history';

describe('LearningHistory', () => {
  let component: LearningHistory;
  let fixture: ComponentFixture<LearningHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
