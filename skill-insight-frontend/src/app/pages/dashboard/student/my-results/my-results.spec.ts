import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyResults } from './my-results';

describe('MyResults', () => {
  let component: MyResults;
  let fixture: ComponentFixture<MyResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
