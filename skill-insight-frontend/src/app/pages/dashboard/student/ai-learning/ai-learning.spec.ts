import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiLearning } from './ai-learning';

describe('AiLearning', () => {
  let component: AiLearning;
  let fixture: ComponentFixture<AiLearning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiLearning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiLearning);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
