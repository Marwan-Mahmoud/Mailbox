import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EmailService } from 'src/app/services/email.service';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.css'],
  providers: [MessageService],
})
export class ComposeComponent {
  show: boolean = false;

  form = new FormGroup({
    to: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', Validators.required),
    body: new FormControl(''),
  });

  constructor(
    private eventBusService: EventBusService,
    private emailService: EmailService,
    private messageService: MessageService
  ) {
    this.eventBusService.showComposeEmailModal.subscribe((email) => {
      if (email) this.form.setValue(email);

      this.show = true;
    });
  }

  send() {
    const { to, subject, body } = this.getFormFields();
    this.emailService.sendEmail(to, subject, body).subscribe(
      () => {
        this.eventBusService.refreshPage.emit();
        this.show = false;
        this.form.reset();
        this.showSuccessMessage('Email sent successfully');
      },
      () => this.showErrorMessage('Error occurred while sending email')
    );
  }

  draft() {
    const { to, subject, body } = this.getFormFields();
    this.emailService.draftEmail(to, subject, body).subscribe(
      () => {
        this.eventBusService.refreshPage.emit();
        this.show = false;
        this.form.reset();
        this.showSuccessMessage('Draft saved successfully');
      },
      () => this.showErrorMessage('Error occurred while saving draft')
    );
  }

  close() {
    const { to, subject, body } = this.getFormFields();
    if (to || subject || body)
      this.draft();
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  private getFormFields() {
    const to = this.form.get('to')?.value as string;
    const subject = this.form.get('subject')?.value as string;
    const body = this.form.get('body')?.value as string;
    return { to, subject, body };
  }
}
