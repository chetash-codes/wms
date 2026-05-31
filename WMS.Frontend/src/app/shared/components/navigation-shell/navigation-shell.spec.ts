import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationShell } from './navigation-shell';

describe('NavigationShell', () => {
  let component: NavigationShell;
  let fixture: ComponentFixture<NavigationShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationShell],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
