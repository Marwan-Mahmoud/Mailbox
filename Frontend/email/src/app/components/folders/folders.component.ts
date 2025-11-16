import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Folder } from 'src/app/models/folder';
import { FolderPage } from 'src/app/models/folder-page';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css'],
  providers: [MessageService]
})
export class FoldersComponent implements AfterViewInit {
  
  @ViewChild('gridContainer') gridContainer: ElementRef | undefined;
  @ViewChild('renameInput') renameInput: ElementRef<HTMLInputElement> | undefined;

  page: FolderPage | undefined;
  selectedFolder: Folder | undefined;
  newFolderName: string = "";
  renaming: boolean = false;
  creating: boolean = false;
  columnCount: number | undefined;
  rowCount: number | undefined;
  sort: any = { field: 'creationDate', order: 'desc' };

  constructor(private folderService: FolderService, private router: Router, private messageService: MessageService) { }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.gridContainer) {
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const gap =  parseFloat(getComputedStyle(this.gridContainer.nativeElement).gap);
        const gridWidth = this.gridContainer.nativeElement.clientWidth;
        const gridHeight = this.gridContainer.nativeElement.clientHeight;
        const itemWidth = 13 * rootFontSize;
        const itemHeight = 10 * rootFontSize;
        
        this.columnCount = Math.floor(gridWidth / (itemWidth + gap));
        this.rowCount = Math.floor(gridHeight / (itemHeight + gap));

        const savedSortField = localStorage.getItem('folderSortField');
        const savedSortOrder = localStorage.getItem('folderSortOrder');
        if (savedSortField) this.sort.field = savedSortField;
        if (savedSortOrder) this.sort.order = savedSortOrder;

        this.fetchPage(this.columnCount * this.rowCount);
      }
    });
  }

  onPageChange(event: any) {
    this.fetchPage((this.columnCount || 0) * (this.rowCount || 0), event.page);
  }

  private fetchPage(size: number, page: number = 0, sort: string = `${this.sort.field},${this.sort.order}`) {
    this.folderService.getFolders(size, page, sort).subscribe(
      (data) => this.page = data,
      () => this.router.navigate(['/login'])
    );
  }

  private refreshPage(): void {
    if (this.page)
      this.fetchPage(this.page.page.size, this.page.page.number);
  }

  openFolder(folder: Folder) {
    this.router.navigate(['/mail/folder', folder.id]);
  }

  createMode() {
    if (!this.creating) {
      this.creating = true;
      let newFolder: Folder = { id: "", name: "" };
      this.page?.content.unshift(newFolder);
      this.selectedFolder = newFolder;
      this.renameMode();
    }
  }

  renameMode() {
    if (this.selectedFolder) {
      this.renaming = true;
      this.newFolderName = this.selectedFolder.name;
      setTimeout(() => {
        this.renameInput?.nativeElement.select();
      });
    }
  }

  renameEnd() {
    if (this.creating) this.createFolder();
    else if (this.renaming) this.renameFolder();
  }
  
  createFolder() {
    if (!this.newFolderName.trim()) {
      this.cancelCreate();
      return;
    }
    
    this.folderService.createFolder(this.newFolderName.trim()).subscribe(
      () => {
        this.creating = false;
        this.renaming = false;
        this.unselectFolder();
        this.refreshPage();
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
    if (this.creating) {
      this.page?.content.shift();
      this.creating = false;
      this.renaming = false;
      this.unselectFolder();
    }
  }

  renameFolder() {
    if (this.selectedFolder && this.newFolderName.trim() && this.newFolderName !== this.selectedFolder.name) {
      this.folderService.renameFolder(this.selectedFolder.id, this.newFolderName.trim()).subscribe(
        () => {
          this.renaming = false;
          this.unselectFolder();
          this.refreshPage();
        },
        () => {
          this.showErrorMessage('Folder name already exists');
          setTimeout(() => {
            this.renameInput?.nativeElement.focus();
          });
        } 
      );
    }
  }

  deleteFolder() {
    if (this.selectedFolder) {
      this.folderService.deleteFolder(this.selectedFolder.id).subscribe(
        () => {
          this.unselectFolder();
          this.showSuccessMessage('Folder deleted successfully');
          this.refreshPage();
        },
        () => this.showErrorMessage('Error occurred while deleting folder')
      );
    }
  }

  toggleSortField() {
    if (this.sort.field === 'creationDate')
      this.sort.field = 'sortableName';
    else
      this.sort.field = 'creationDate';

    localStorage.setItem('folderSortField', this.sort.field);
    this.refreshPage();
  }

  toggleSortOrder() {
    if (this.sort.order === 'asc')
      this.sort.order = 'desc';
    else
      this.sort.order = 'asc';

    localStorage.setItem('folderSortOrder', this.sort.order);
    this.refreshPage();
  }

  selectFolder(folder: Folder) {
    this.selectedFolder = folder;
  }

  unselectFolder() {
    this.selectedFolder = undefined;
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({ key:'success', severity: 'success', summary: 'Success', detail: message });
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ key:'error', severity: 'error', summary: 'Error', detail: message });
  }

  get folders(): Folder[] {
    return this.page?.content.slice(0, (this.columnCount || 0) * (this.rowCount || 0)) || [];
  }

  get columnsCount() {
    return `repeat(${this.columnCount}, minmax(0, 14rem))`;
  }

}
