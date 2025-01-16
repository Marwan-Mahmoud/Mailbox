import { Component, Input } from '@angular/core';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {

  @Input() open: boolean = true;

  buttons: any[] = [
    { name: 'Inbox', icon: 'pi pi-envelope', link: 'inbox' },
    { name: 'Sent', icon: 'pi pi-send', link: 'sent' },
    { name: 'Drafts', icon: 'pi pi-file-edit', link: 'drafts' },
    { name: 'Trash', icon: 'pi pi-trash', link: 'trash' },
    { name: 'Folders', icon: 'pi pi-folder', link: 'folders' },
  ];

  constructor(private eventBusService: EventBusService) {}

  showComposeEmailModal() {
    this.eventBusService.showComposeEmailModal.emit();
  }
}
