import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningMaterials } from './learning-materials';

describe('LearningMaterials', () => {
  let component: LearningMaterials;
  let fixture: ComponentFixture<LearningMaterials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningMaterials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningMaterials);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
