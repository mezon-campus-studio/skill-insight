import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAnalysis } from './student-analysis';

describe('StudentAnalysis', () => {
  let component: StudentAnalysis;
  let fixture: ComponentFixture<StudentAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
