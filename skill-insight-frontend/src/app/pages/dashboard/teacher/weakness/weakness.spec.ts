import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Weakness } from './weakness';

describe('Weakness', () => {
  let component: Weakness;
  let fixture: ComponentFixture<Weakness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Weakness]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Weakness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
