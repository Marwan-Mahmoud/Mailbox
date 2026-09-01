import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';
import { EventBusService } from 'src/app/services/event-bus.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { Email } from 'src/app/models/email';
import { Editor } from 'primeng/editor';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.css'],
  providers: [MessageService],
})
export class ComposeComponent implements OnInit, OnDestroy {
  @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent | undefined;
  @ViewChild('editor') editor: Editor | undefined;
  show: boolean = false;
  form = new FormGroup({
    to: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', Validators.required),
    body: new FormControl(''),
  });

  private subscription!: Subscription;

  constructor(
    private eventBusService: EventBusService,
    private emailService: EmailService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.subscription = this.eventBusService.showComposeEmailModal.subscribe((email) => {
      if (email) this.form.setValue(email);
      this.show = true;
      setTimeout(() => {
        if (this.editor?.quill) {
          this.editor.quill.clipboard.dangerouslyPasteHTML(email.body || '');
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  send() {
    const email = this.createEmail();
    this.emailService.sendEmail(email).subscribe(
      () => {
        this.eventBusService.refreshPage.emit();
        this.show = false;
        this.form.reset();
        this.fileUpload?.clear();
        this.showSuccessMessage('Email sent successfully');
      },
      (error) => {
        if (error.status === 422) this.showErrorMessage('Recipient not found')
        else this.showErrorMessage('Error occurred while sending email')
      }
    );
  }

  draft() {
    const email = this.createEmail();
    this.emailService.draftEmail(email).subscribe(
      () => {
        this.eventBusService.refreshPage.emit();
        this.show = false;
        this.form.reset();
        this.showSuccessMessage('Draft saved successfully');
      },
      () => this.showErrorMessage('Error occurred while saving draft')
    );
  }

  autoDraft() {
    // auto-draft on close if form has content
    const email = this.createEmail();
    if (email.to || email.subject || email.body)
      this.draft();
  }

  private createEmail() {
    const { to, subject, body } = this.getFormFields();
    const email: Partial<Email> = {
      to: to,
      subject: subject,
      body: body
    };
    if (this.fileUpload?.attachments) {
      email.attachmentsId = this.fileUpload.attachments.map((attachment) => attachment.id!);
    }
    return email;
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

  get uploadOngoing() {
    return (this.fileUpload?.uploadOngoingCount || 0) > 0 ;
  }
}
