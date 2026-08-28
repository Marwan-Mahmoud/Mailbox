import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Attachment } from '../models/attachment';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  private ongoingUpload: Map<Attachment, Subscription> | undefined;

  constructor(private api: ApiService, private http: HttpClient) {
    this.ongoingUpload = new Map();
  }

  getSignedDownloadURL(id: string) {
    return this.api.getSignedDownloadURL(id);
  }

  upload(attachment: Attachment, file: File, callback: ()=> void) {
    const uploadObservable = this.getSignedUploadURL(attachment).pipe(
      switchMap((signedUrl) => {
        return this.http.put(String(signedUrl), file, {reportProgress: true, observe: 'events'});
      }));
    const subscription = uploadObservable.subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          attachment.progress = Math.round((event.loaded / (event.total ?? attachment.size)) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.ongoingUpload?.delete(attachment);
          const attachmentId = this.extractAttachmentId(event.body);
          attachment.id = attachmentId;
          this.confirmUpload(attachmentId!).subscribe();
          callback();
        }
      },
      (error) => console.error('Upload failed', error));
    this.ongoingUpload?.set(attachment, subscription);
  }

  cancelUpload(attachment: Attachment) {
    const subscription = this.ongoingUpload?.get(attachment);
    if (subscription) {
      subscription.unsubscribe();
      this.ongoingUpload?.delete(attachment);
    }
  }

  private getSignedUploadURL(attachment: Attachment) {
    return this.api.getSignedUploadURL(attachment);
  }

  private confirmUpload(id: string) {
    return this.api.confirmUpload(id);
  }

  private extractAttachmentId(response: { Key?: string; }) {
    return response.Key?.split('/').pop();
  }
}
