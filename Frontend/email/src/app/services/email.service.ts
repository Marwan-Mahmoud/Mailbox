import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Email } from '../models/email';
import { Attachment } from '../models/attachment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private api: ApiService) { }

  getPage(folder: string, size: number, page: number, sort: string, queryParams?: any) {
    return this.api.getPage(folder, size, page, sort, queryParams);
  }

  sendEmail(email: Partial<Email>) {
    email.from = localStorage.getItem('userEmail') as string;
    return this.api.sendEmail(email);
  }

  draftEmail(email: Partial<Email>) {
    email.from = localStorage.getItem('userEmail') as string;
    return this.api.draftEmail(email);
  }

  delete(folder: string, emails: Email[]) {
    const ids = emails.map((email) => email.id);
    return this.api.deleteEmails(folder, ids);
  }

  restore(emails: Email[]) {
    const ids = emails.map((email) => email.id);
    return this.api.restoreEmails(ids);
  }

  markAs(emails: Email[], read: boolean) {
    const ids = emails.map((email) => email.id);
    return this.api.markAs(ids, read);
  }
}
