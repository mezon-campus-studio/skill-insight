import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassEdit } from './class-edit';

describe('ClassEdit', () => {
  let component: ClassEdit;
  let fixture: ComponentFixture<ClassEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
