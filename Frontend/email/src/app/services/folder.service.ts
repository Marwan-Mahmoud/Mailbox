import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Folder } from '../models/folder';
import { Email } from '../models/email';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private api: ApiService) { }

  getFolders(size: number, page: number, sort: string) {
    return this.api.getFolders(size, page, sort);
  }

  createFolder(name: string) {
    return this.api.createFolder(name);
  }

  renameFolder(folderId: string, newName: string) {
    return this.api.renameFolder(folderId, newName);
  }

  deleteFolder(folderId: string) {
    return this.api.deleteFolder(folderId);
  }

  addEmailsToFolder(folderId: string, emails: Email[]) {
    const emailIds = emails.map(email => email.id);
    return this.api.addEmailsToFolder(folderId, emailIds);
  }

  removeEmailsFromFolder(folderId: string, emails: Email[]) {
    const emailIds = emails.map(email => email.id);
    return this.api.removeEmailsFromFolder(folderId, emailIds);
  }
}
