import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Email } from 'src/app/models/email';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.css'],
})
export class EmailViewComponent implements OnInit, OnDestroy {
  email: Email | undefined;
  show = false;
  toggleAttachmentListPanel = new EventEmitter<any>();

  private subscription!: Subscription;

  @Input() replyBtn: boolean = false;
  @Input() moveToTrashBtn: boolean = false;
  @Input() deleteBtn: boolean = false;
  @Input() restoreBtn: boolean = false;
  @Input() removeEmailsBtn: boolean = false;

  constructor(private eventBusService: EventBusService) {}
  
  ngOnInit(): void {
    this.subscription = this.eventBusService.showEmail.subscribe((email: Email) => {
      this.email = email;
      this.show = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  replyToEmail() {
    this.show = false;
    this.eventBusService.showComposeEmailModal.emit({
      to: this.email?.from,
      subject: 'RE: ' + this.email?.subject,
      body: '',
    });
  }

  restoreEmail(): void {
    this.emitAndClose(this.eventBusService.restoreEmail);
  }

  moveEmailToTrash(): void {
    this.emitAndClose(this.eventBusService.moveEmailToTrash);
  }

  deleteEmail(): void {
    this.emitAndClose(this.eventBusService.deleteEmail);
  }

  removeEmailFromFolder(): void {
    this.emitAndClose(this.eventBusService.removeEmailFromFolder);
  }

  toggleOverlayPanel($event: any) {
    this.toggleAttachmentListPanel.emit($event);
  }

  private emitAndClose(emitter: { emit: (email: Email) => void }): void {
    if (!this.email) return;

    emitter.emit(this.email);
    this.show = false;
  }
}
