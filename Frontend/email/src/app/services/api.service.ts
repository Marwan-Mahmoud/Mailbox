import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { EmailPage } from '../models/email-page';
import { FolderPage } from '../models/folder-page';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(user: User) {
    return this.http.post(`${this.baseUrl}/login`, user, {
      withCredentials: true,
    });
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, null, {
      withCredentials: true
    });
  }

  signup(user: User) {
    return this.http.post(`${this.baseUrl}/signup`, user, {
      withCredentials: true,
    });
  }

  getPage(folder: string, size: number, page: number, sort: string, queryParams?: any) {
    const options = {
      params: {
        size: size,
        page: page,
        sort: sort,
        ...queryParams
      },
      withCredentials: true,
    };
    return this.http.get<EmailPage>(`${this.baseUrl}/${folder}`, options);
  }

  sendEmail(email: any) {
    const options = {
      withCredentials: true,
    };
    return this.http.post(`${this.baseUrl}/compose/send`, email, options);
  }

  draftEmail(email: any) {
    const options = {
      withCredentials: true,
    };
    return this.http.post(`${this.baseUrl}/compose/draft`, email, options);
  }

  deleteEmails(folder: string, ids: string[]) {
    const options = {
      withCredentials: true,
      body: ids,
    };
    return this.http.delete(`${this.baseUrl}/${folder}`, options);
  }

  restoreEmails(ids: string[]) {
    const options = {
      withCredentials: true
    };
    return this.http.post(`${this.baseUrl}/trash`, ids, options);
  }

  markAs(ids: string[], read: boolean) {
    const options = {
      params: {
        read: read
      },
      withCredentials: true,
    };
    return this.http.patch(`${this.baseUrl}/inbox`, ids, options);
  }

  getFolders(size: number, page: number, sort: string) {
    const options = {
      params: {
        size: size,
        page: page,
        sort: sort
      },
      withCredentials: true,
    };
    return this.http.get<FolderPage>(`${this.baseUrl}/folders`, options);
  }

  createFolder(name: string) {
    const options = {
      params: {
        name: name
      },
      withCredentials: true,
    };
    return this.http.post(`${this.baseUrl}/folders`, null, options);
  }

  renameFolder(folderId: string, newName: string) {
    const options = {
      params: {
        name: newName
      },
      withCredentials: true,
    };
    return this.http.patch(`${this.baseUrl}/folders/rename/${folderId}`, null, options);
  }

  deleteFolder(folderId: string) {
    const options = {
      withCredentials: true,
    };
    return this.http.delete(`${this.baseUrl}/folders/${folderId}`, options);
  }
  
}
