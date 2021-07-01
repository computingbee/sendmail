import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsListComponent } from './emails-list.component';

describe('EmailsListComponent', () => {
  let component: EmailsListComponent;
  let fixture: ComponentFixture<EmailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
