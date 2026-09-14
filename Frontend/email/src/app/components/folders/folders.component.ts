import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Folder } from 'src/app/models/folder';
import { FolderPage } from 'src/app/models/folder-page';
import { FolderService } from 'src/app/services/folder.service';

type SortField = 'creationDate' | 'sortableName';
type SortOrder = 'asc' | 'desc';
type Mode = 'browsing' | 'creating' | 'renaming';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class FoldersComponent implements AfterViewInit {
  
  @ViewChild('gridContainer') gridContainer: ElementRef | undefined;
  @ViewChild('renameInput') renameInput: ElementRef<HTMLInputElement> | undefined;

  page: FolderPage | undefined;
  selectedFolder: Folder | null = null;
  newFolderName: string = "";
  mode: Mode = 'browsing';
  sort: { field: SortField; order: SortOrder } = {
    field: 'creationDate',
    order: 'desc',
  };
  
  private tempFolder: Folder | null = null;
  private rowCount: number | undefined;
  private columnCount: number | undefined;

  constructor(
    private folderService: FolderService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.calculateLayout();
    this.cdr.detectChanges();
    this.restoreSort();
    this.fetchPage(this.pageSize);
  }

  onPageChange(event: any) {
    this.fetchPage(this.pageSize, event.page);
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

  createMode() {
    if (this.mode !== 'creating') {
      this.mode = 'creating';
      this.tempFolder = { id: "", name: "" };
      this.selectedFolder = this.tempFolder;
      this.newFolderName = "";
      setTimeout(() => {
        this.renameInput?.nativeElement.select();
      });
    }
  }

  renameMode() {
    if (this.selectedFolder) {
      this.mode = 'renaming';
      this.newFolderName = this.selectedFolder.name;
      setTimeout(() => {
        this.renameInput?.nativeElement.select();
      });
    }
  }

  browsingMode() {
    this.mode = 'browsing';
    this.tempFolder = null;
    this.unselectFolder();
  }

  confirmNewName() {
    if (this.mode === 'creating') this.createFolder();
    else if (this.mode === 'renaming') this.renameFolder();
  }
  
  createFolder() {
    if (!this.newFolderName.trim()) {
      this.browsingMode();
      return;
    }
    
    this.folderService.createFolder(this.newFolderName.trim()).subscribe(
      () => {
        this.browsingMode();
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

  renameFolder() {
    if (this.selectedFolder && this.newFolderName.trim() && this.newFolderName !== this.selectedFolder.name) {
      this.folderService.renameFolder(this.selectedFolder.id, this.newFolderName.trim()).subscribe(
        () => {
          this.browsingMode();
          this.refreshPage();
        },
        () => {
          this.showErrorMessage('Folder name already exists');
          setTimeout(() => {
            this.renameInput?.nativeElement.focus();
          });
        }
      );
    } else {
      this.browsingMode();
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
    this.sort.field = this.sort.field === 'creationDate' ? 'sortableName': 'creationDate';
    localStorage.setItem('folderSortField', this.sort.field);
    this.refreshPage();
  }

  toggleSortOrder() {
    this.sort.order = this.sort.order === 'asc' ? 'desc' : 'asc';
    localStorage.setItem('folderSortOrder', this.sort.order);
    this.refreshPage();
  }
  
  private restoreSort() {
    const savedSortField = localStorage.getItem('folderSortField') as SortField | null;
    const savedSortOrder = localStorage.getItem('folderSortOrder') as SortOrder | null;
    if (savedSortField) this.sort.field = savedSortField;
    if (savedSortOrder) this.sort.order = savedSortOrder;
  }

  clickOnFolder(folder: Folder) {
    if (this.mode === 'browsing') this.selectFolder(folder);
  }

  clickOnVoid() {
    if (this.mode === 'browsing') this.unselectFolder();
  }

  openFolder(folder: Folder) {
    this.router.navigate(['/mail/folder', folder.id]);
  }

  selectFolder(folder: Folder) {
    this.selectedFolder = folder;
  }

  unselectFolder() {
    this.selectedFolder = null;
  }

  confirmDeletion() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this folder?',
      header: 'Delete Folder',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.deleteFolder();
      }
    });
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({ key:'success', severity: 'success', summary: 'Success', detail: message });
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ key:'error', severity: 'error', summary: 'Error', detail: message });
  }

  private calculateLayout() {
    if (this.gridContainer) {
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const gap = parseFloat(getComputedStyle(this.gridContainer.nativeElement).gap);
      const gridWidth = this.gridContainer.nativeElement.clientWidth;
      const gridHeight = this.gridContainer.nativeElement.clientHeight;
      const itemWidth = 13 * rootFontSize;
      const itemHeight = 10 * rootFontSize;

      this.columnCount = Math.floor(gridWidth / (itemWidth + gap));
      this.rowCount = Math.floor(gridHeight / (itemHeight + gap));
    }
  }

  get pageSize(): number {
    return (this.columnCount || 0) * (this.rowCount || 0);
  }

  get folders(): Folder[] {
    let folders = this.page?.content.slice(0, this.pageSize) || [];
    if (this.tempFolder) {
      if (folders.length >= this.pageSize) {
        folders.pop();
      }
      folders.unshift(this.tempFolder);
    }
    return folders;
  }

  get columnsCount() {
    return `repeat(${this.columnCount}, minmax(0, 14rem))`;
  }
}
