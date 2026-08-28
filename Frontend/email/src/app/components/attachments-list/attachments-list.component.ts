import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Attachment } from 'src/app/models/attachment';
import { getMimeIcon } from './mime-icons';
import { AttachmentService } from 'src/app/services/attachment.service';


@Component({
  selector: 'attachments-list',
  templateUrl: './attachments-list.component.html',
  styleUrls: ['./attachments-list.component.css']
})
export class AttachmentsListComponent implements OnInit {
  @ViewChild('op') overlayPanel: any;
  @Input() attachments: Attachment[] = [];
  @Input() cancelBtn: boolean = false;
  @Input() showProgress: boolean = false;
  @Input() toggleEvents: EventEmitter<any> | undefined;
  getMimeIcon = getMimeIcon;

  constructor(private attachmentService: AttachmentService) {}

  ngOnInit(): void {
    this.toggleEvents?.subscribe(($event) => {
      this.overlayPanel?.toggle($event);
    });
  }

  downloadAttachment(attachmentId: string) {
    if (attachmentId) {
      this.attachmentService.getSignedDownloadURL(attachmentId).subscribe(url => {
        window.open(url, '_blank');
      });
    }
  }

  cancelAttachment(attachment: Attachment): void {
    const index = this.attachments.indexOf(attachment);
    if (index !== -1) {
      this.attachments.splice(index, 1);
      setTimeout(() => {
        this.overlayPanel?.align();
      }, 0);
    }
    if (this.attachments.length === 0) {
      this.overlayPanel?.hide();
    }
  }
}
