import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTopic } from './create-topic';

describe('CreateTopic', () => {
  let component: CreateTopic;
  let fixture: ComponentFixture<CreateTopic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTopic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTopic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
