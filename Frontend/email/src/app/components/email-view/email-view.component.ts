import { Component, Input } from '@angular/core';
import { Email } from 'src/app/models/email';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.css'],
})
export class EmailViewComponent {
  email: Email | undefined;
  show = false;

  @Input() replyBtn: boolean = false;
  @Input() moveToTrashBtn: boolean = false;
  @Input() deleteBtn: boolean = false;
  @Input() restoreBtn: boolean = false;

  constructor(private eventBusService: EventBusService) {
    this.eventBusService.showEmail.subscribe((email: Email) => {
      this.email = email;
      this.show = true;
    });
  }

  replyEmail() {
    this.show = false;
    this.eventBusService.showComposeEmailModal.emit({
      to: this.email?.from,
      subject: 'RE: ' + this.email?.subject,
      body: '',
    });
  }

  restoreEmail() {
    this.eventBusService.restoreEmail.emit(this.email);
    this.show = false;
  }

  moveEmailToTrash() {
    this.eventBusService.moveEmailToTrash.emit(this.email);
    this.show = false;
  }

  deleteEmail() {
    this.eventBusService.deleteEmail.emit(this.email);
    this.show = false;
  }
}
