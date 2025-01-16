import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsTableComponent } from './emails-table.component';

describe('EmailsTableComponent', () => {
  let component: EmailsTableComponent;
  let fixture: ComponentFixture<EmailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
