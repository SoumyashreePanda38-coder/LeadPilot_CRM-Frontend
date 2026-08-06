import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveLayoutComponent } from './executive-layout.component';

describe('ExecutiveLayoutComponent', () => {
  let component: ExecutiveLayoutComponent;
  let fixture: ComponentFixture<ExecutiveLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutiveLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutiveLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
