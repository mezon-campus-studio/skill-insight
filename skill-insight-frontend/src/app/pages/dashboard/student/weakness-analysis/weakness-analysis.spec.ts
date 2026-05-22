import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaknessAnalysis } from './weakness-analysis';

describe('WeaknessAnalysis', () => {
  let component: WeaknessAnalysis;
  let fixture: ComponentFixture<WeaknessAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaknessAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaknessAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
