import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeControl } from './practice-control';

describe('PracticeControl', () => {
  let component: PracticeControl;
  let fixture: ComponentFixture<PracticeControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
