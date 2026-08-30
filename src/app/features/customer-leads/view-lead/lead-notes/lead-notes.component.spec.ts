import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadNotesComponent } from './lead-notes.component';

describe('LeadNotesComponent', () => {
  let component: LeadNotesComponent;
  let fixture: ComponentFixture<LeadNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
