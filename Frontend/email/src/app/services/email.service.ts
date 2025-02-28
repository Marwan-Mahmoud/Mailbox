import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Email } from '../models/email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private api: ApiService) { }

  getPage(folder: string, size: number, page: number, sort: string, queryParams?: any) {
    return this.api.getPage(folder, size, page, sort, queryParams);
  }

  sendEmail(to: string, subject: string, body: string) {
    const email = {
      from: localStorage.getItem('userEmail') as string,
      to: to,
      subject: subject,
      body: body
    };
    return this.api.sendEmail(email);
  }

  draftEmail(to: string, subject: string, body: string) {
    const email = {
      from: localStorage.getItem('userEmail') as string,
      to: to,
      subject: subject,
      body: body
    };
    return this.api.draftEmail(email);
  }

  delete(folder: string, emails: Email[]) {
    const ids = emails.map((email) => email.id);
    return this.api.delete(folder, ids);
  }

  restore(emails: Email[]) {
    const ids = emails.map((email) => email.id);
    return this.api.restore(ids);
  }

  markAs(emails: Email[], read: boolean) {
    const ids = emails.map((email) => email.id);
    return this.api.markAs(ids, read);
  }
}
