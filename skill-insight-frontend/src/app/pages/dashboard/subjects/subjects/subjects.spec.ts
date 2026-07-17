import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subject } from './subjects';

describe('Subject Component', () => {

  let component: Subject;
  let fixture: ComponentFixture<Subject>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [Subject]
    }).compileComponents();

    fixture = TestBed.createComponent(Subject);
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});