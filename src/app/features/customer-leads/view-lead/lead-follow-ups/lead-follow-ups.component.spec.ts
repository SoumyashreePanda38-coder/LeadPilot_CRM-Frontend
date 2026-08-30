import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadFollowUpsComponent } from './lead-follow-ups.component';

describe('LeadFollowUpsComponent', () => {
  let component: LeadFollowUpsComponent;
  let fixture: ComponentFixture<LeadFollowUpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadFollowUpsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadFollowUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
