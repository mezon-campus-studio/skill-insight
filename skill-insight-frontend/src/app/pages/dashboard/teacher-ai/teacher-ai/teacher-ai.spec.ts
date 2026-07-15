import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAi } from './teacher-ai';

describe('TeacherAi', () => {
  let component: TeacherAi;
  let fixture: ComponentFixture<TeacherAi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
