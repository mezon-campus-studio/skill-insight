import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignHistory } from './assign-history';

describe('AssignHistory', () => {
  let component: AssignHistory;
  let fixture: ComponentFixture<AssignHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
