import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { Email } from 'src/app/models/email';
import { EmailPage } from 'src/app/models/email-page';
import { EmailService } from 'src/app/services/email.service';
import { EventBusService } from 'src/app/services/event-bus.service';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'emails-table',
  templateUrl: './emails-table.component.html',
  styleUrls: ['./emails-table.component.css'],
  providers: [DatePipe, MessageService, ConfirmationService]
})
export class EmailsTableComponent implements OnInit, OnDestroy {
  page: EmailPage | undefined;
  selectedEmails: Email[] = [];

  private queryParams: Params | undefined;
  private subscriptions: Subscription = new Subscription();

  @Input() folder: string = '';
  @Input() queryParamsObservable: Observable<Params> | undefined;
  @Input() col1: string = '';
  @Input() boldUnreadEmails: boolean = false;
  @Input() readUnreadBtn: boolean = false;
  @Input() moveToTrashBtn: boolean = false;
  @Input() deleteBtn: boolean = false;
  @Input() removeEmailsBtn: boolean = false;
  @Input() restoreBtn: boolean = false;
  @Input() addToFolderBtn: boolean = false;

  constructor(
    private emailService: EmailService,
    private folderService: FolderService,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    this.initEventBusSubscriptions();

    if (this.queryParamsObservable) {
      this.subscriptions.add(
        this.queryParamsObservable.subscribe((params) => {
          this.queryParams = params;
          this.refreshPage();
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  lazyLoadData(event: LazyLoadEvent) {
    if (event.first == undefined || event.rows == undefined) return;
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

  confirmDeletion() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete these emails?',
      header: 'Delete Emails',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.deleteEmails();
      }
    });
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
  
  addEmailsToFolder() {
    if (this.selectedEmails.length > 0) {
      this.eventBusService.showAddToFolderDialog.emit(this.selectedEmails);
    }
  }
  
  removeEmailsFromFolder() {
    if (this.selectedEmails.length === 0) return;

    const folderId = this.folder.split('/').at(-1);
    this.folderService.removeEmailsFromFolder(folderId!, this.selectedEmails).subscribe(
      () => {
        this.showSuccessMessage('Emails removed successfully');
        this.refreshPage();
        this.selectedEmails = [];
      },
      () => this.showErrorMessage('Error occurred while removing emails')
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

  private refreshPage(): void {
    if (this.page) {
      this.fetchPage(this.page.page.size, this.page.page.number);
    }
  }

  private initEventBusSubscriptions(): void {
    this.subscriptions.add(
      this.eventBusService.restoreEmail.subscribe((email) => {
        this.handleSingleEmailAction(email, () => this.restoreEmails());
      })
    );

    this.subscriptions.add(
      this.eventBusService.moveEmailToTrash.subscribe((email) => {
        this.handleSingleEmailAction(email, () => this.moveEmailsToTrash());
      })
    );

    this.subscriptions.add(
      this.eventBusService.deleteEmail.subscribe((email) => {
        this.handleSingleEmailAction(email, () => this.confirmDeletion());
      })
    );

    this.subscriptions.add(
      this.eventBusService.removeEmailFromFolder.subscribe((email) => {
        this.handleSingleEmailAction(email, () => this.removeEmailsFromFolder());
      })
    );

    this.subscriptions.add(
      this.eventBusService.refreshPage.subscribe(() => this.refreshPage())
    );
  }

  private handleSingleEmailAction(email: Email, action: () => void): void {
    this.selectedEmails = [email];
    action();
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({ key:'success', severity: 'success', summary: 'Success', detail: message });
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ key:'error', severity: 'error', summary: 'Error', detail: message });
  }
}
