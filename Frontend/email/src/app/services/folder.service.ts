import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

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
}
