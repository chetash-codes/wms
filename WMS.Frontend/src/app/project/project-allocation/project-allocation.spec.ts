import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAllocation } from './project-allocation';

describe('ProjectAllocation', () => {
  let component: ProjectAllocation;
  let fixture: ComponentFixture<ProjectAllocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectAllocation],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectAllocation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
