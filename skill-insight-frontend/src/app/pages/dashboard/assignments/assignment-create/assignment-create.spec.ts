import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentCreate } from './assignment-create';

describe('AssignmentCreate', () => {
  let component: AssignmentCreate;
  let fixture: ComponentFixture<AssignmentCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
