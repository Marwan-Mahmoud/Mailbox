import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent {

  private folderId: string | null;

  constructor(private route: ActivatedRoute) {
    this.folderId = this.route.snapshot.paramMap.get('id');
   }

  get folderURI(): string {
    return `folders/${this.folderId}`;
  }
}
