import { Component, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Attachment } from 'src/app/models/attachment';
import { AttachmentService } from 'src/app/services/attachment.service';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  attachments: Attachment[] = [];
  uploadStatusPulse: boolean = false;
  firstUpload: boolean = false;
  toggleAttachmentListPanel = new EventEmitter<any>();
  
  constructor(
    private attachmentService: AttachmentService,
    private messageService: MessageService
  ) {}

  onFileSelected($event: Event) {
    const attachment = this.getAttachment($event);
    if (attachment) {
      const {file, metadata} = attachment;
      if (this.validateUpload(metadata)) {
        this.updateState(metadata);
        this.attachmentService.upload(metadata, file);
      }
    }
  }

  private getAttachment($event: Event) {
    const input = $event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return null

    return {
      file,
      metadata: {
        filename: file.name,
        contentType: file.type,
        size: file.size,
      },
    }
  }

  private validateUpload(attachment: Attachment) {
    if (this.attachments.length >= 5) {
      this.showErrorMessage('Maximum number of attachments per email is 5')
      return false;
    }
    if (attachment.size < 1) {
      this.showErrorMessage('File is empty')
      return false;
    }
    if (attachment.size > 20971520) {
      this.showErrorMessage('File size exceeds the maximum limit of 20MB')
      return false;
    }
    if (!attachment.filename) {
      this.showErrorMessage('File name is empty')
      return false;
    }
    return true;
  }

  private updateState(attachment: Attachment) {
    attachment.state = 'ongoing';
    this.uploadStatusPulse = true;
    this.attachments.push(attachment);
    this.firstUpload = this.attachments.length === 1;
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  clear() {
    this.attachments = []
    this.firstUpload = false;
  }

  toggleOverlayPanel($event: any) {
    this.toggleAttachmentListPanel.emit($event);
  }

  get uploadOngoingCount() {
    return this.attachments.filter(attachment => attachment.state === 'ongoing').length;
  }
}
