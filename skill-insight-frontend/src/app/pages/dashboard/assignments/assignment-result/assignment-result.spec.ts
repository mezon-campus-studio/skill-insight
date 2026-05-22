import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentResult } from './assignment-result';

describe('AssignmentResult', () => {
  let component: AssignmentResult;
  let fixture: ComponentFixture<AssignmentResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
