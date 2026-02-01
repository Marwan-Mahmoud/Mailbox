import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Email } from 'src/app/models/email';
import { Folder } from 'src/app/models/folder';
import { EventBusService } from 'src/app/services/event-bus.service';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'add-to-folder',
  templateUrl: './add-to-folder.component.html',
  styleUrls: ['./add-to-folder.component.css'],
  providers: [MessageService],
})
export class AddToFolderComponent {

  @ViewChild('renameInput') renameInput: ElementRef<HTMLInputElement> | undefined;

  show: boolean = false;
  folders: Folder[] = [];
  selectedFolder: Folder | undefined;
  selectedEmails: Email[] = [];
  creating: boolean = false;
  newFolderName: string = "";

  constructor(
    private eventBusService: EventBusService,
    private folderService: FolderService,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.eventBusService.showAddToFolderDialog.subscribe((emails: Email[]) => {
      this.selectedEmails = emails;
      this.show = true;
    });
  }

  ngOnInit(): void {
    this.fetchFolders();
  }

  selectFolder(folder: Folder) {
    this.selectedFolder = folder;
    this.show = false;

    this.folderService.addEmailsToFolder(folder.id, this.selectedEmails).subscribe(
      () => this.showSuccessMessage('Emails added to folder successfully'),
      () => this.showErrorMessage('Error occurred while adding emails to folder'),
    );
  }

  createMode() {
    if (!this.creating) {
      this.creating = true;
      this.newFolderName = "";
      
      setTimeout(() => {
        this.renameInput?.nativeElement.select();
      });
    }
  }

  createEnd() {
    if (!this.newFolderName.trim()) {
      this.cancelCreate();
      return;
    }
    
    this.folderService.createFolder(this.newFolderName.trim()).subscribe(
      () => {
        this.creating = false;
        this.fetchFolders();
      },
      () => {
        this.showErrorMessage('Folder name already exists');
        setTimeout(() => {
          this.renameInput?.nativeElement.focus();
        });
      }
    );
  }
  
  cancelCreate() {
    this.creating = false;
  }

  private fetchFolders() {
    this.folderService.getFolders(-1, -1, 'creationDate,desc').subscribe(
      (data) => (this.folders = data.content),
      () => this.router.navigate(['/login']),
    );
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
  
}
