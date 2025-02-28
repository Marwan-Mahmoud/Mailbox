import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Email } from 'src/app/models/email';
import { Page } from 'src/app/models/page';
import { EmailService } from 'src/app/services/email.service';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'emails-table',
  templateUrl: './emails-table.component.html',
  styleUrls: ['./emails-table.component.css'],
  providers: [DatePipe, MessageService]
})
export class EmailsTableComponent {
  page: Page | undefined;
  selectedEmails: Email[] = [];
  queryParams: Params | undefined;

  @Input() folder: string = '';
  @Input() queryParamsObservable: Observable<Params> | undefined;
  @Input() col1: string = '';
  @Input() boldUnreadEmails: boolean = false;
  @Input() readUnreadBtn: boolean = false;
  @Input() moveToTrashBtn: boolean = false;
  @Input() deleteBtn: boolean = false;
  @Input() restoreBtn: boolean = false;
  @Input() addToFolderBtn: boolean = false;

  constructor(
    private emailService: EmailService,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private eventBusService: EventBusService
  ) {
    this.eventBusService.restoreEmail.subscribe((email: Email) => {
      this.selectedEmails = [email];
      this.restoreEmails();
    });

    this.eventBusService.moveEmailToTrash.subscribe((email: Email) => {
      this.selectedEmails = [email];
      this.moveEmailsToTrash();
    });

    this.eventBusService.deleteEmail.subscribe((email: Email) => {
      this.selectedEmails = [email];
      this.deleteEmails();
    });

    this.eventBusService.refreshPage.subscribe(() => this.refreshPage());
  }

  ngOnInit(): void {
    this.queryParamsObservable?.subscribe((params) => {
      this.queryParams = params;
      this.refreshPage();
    });
  }

  lazyLoadData(event: any) {
    this.fetchPage(event.rows, event.first / event.rows);
  }

  viewEmail(index: number) {
    index = index % this.page!.page.size;
    const clickedEmail = this.page!.content[index];

    this.eventBusService.showEmail.emit(clickedEmail);

    if (this.folder === 'inbox' && !clickedEmail.read) {
      this.emailService.markAs([clickedEmail], true).subscribe(
        () => clickedEmail.read = true,
        (error) => console.error(error)
      );
    }
  }

  editDraft(index: number) {
    index = index % this.page!.page.size;
    const clickedEmail = this.page!.content[index];
    
    this.eventBusService.showComposeEmailModal.emit({
      to: clickedEmail.to,
      subject: clickedEmail.subject,
      body: clickedEmail.body,
    });
    this.emailService.delete('drafts', [clickedEmail]).subscribe();
  }

  moveEmailsToTrash() {
    if (this.selectedEmails.length === 0) return;

    this.emailService.delete(this.folder, this.selectedEmails).subscribe(
      () => {
        this.showSuccessMessage('Emails moved to trash successfully');
        this.refreshPage();
        this.selectedEmails = [];
      },
      () => this.showErrorMessage('Error occurred while moving emails to trash')
    );
  }

  deleteEmails() {
    if (this.selectedEmails.length === 0) return;

    this.emailService.delete(this.folder, this.selectedEmails).subscribe(
      () => {
        this.showSuccessMessage('Emails deleted successfully');
        this.refreshPage();
        this.selectedEmails = [];
      },
      () => this.showErrorMessage('Error occurred while deleting emails')
    );
  }

  restoreEmails() {
    if (this.selectedEmails.length === 0) return;

    this.emailService.restore(this.selectedEmails).subscribe(
      () => {
        this.showSuccessMessage('Emails restored successfully');
        this.fetchPage(this.page!.page.size);
        this.selectedEmails = [];
      },
      () => this.showErrorMessage('Error occurred while restoring emails')
    );
  }

  markAs() {
    if (this.selectedEmails.length === 0) return;

    const read = this.selectedEmails.some((email) => !email.read);
    this.emailService.markAs(this.selectedEmails, read).subscribe(
      () => {
        this.selectedEmails.forEach((email) => (email.read = read));
        this.selectedEmails = [];
      },
      () => this.showErrorMessage('Error occurred while updating emails')
    );
  }

  formatDate(date: string) {
    const today = new Date();
    const emailDate = new Date(date);
    const isToday =
      today.getFullYear() === emailDate.getFullYear() &&
      today.getMonth() === emailDate.getMonth() &&
      today.getDate() === emailDate.getDate();
    return this.datePipe.transform(date, isToday ? 'shortTime' : 'mediumDate');
  }

  private fetchPage(size: number = 10, page: number = 0, sort: string = 'date,desc') {
    this.emailService.getPage(this.folder, size, page, sort, this.queryParams).subscribe(
      (data) => this.page = data,
      () => this.router.navigate(['/login'])
    );
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({ key:'success', severity: 'success', summary: 'Success', detail: message });
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ key:'error', severity: 'error', summary: 'Error', detail: message });
  }
  
  private refreshPage(): void {
    if (this.page)
      this.fetchPage(this.page.page.size, this.page.page.number);
  }
}
