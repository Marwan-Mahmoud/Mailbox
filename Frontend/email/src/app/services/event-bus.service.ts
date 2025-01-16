import { EventEmitter, Injectable } from '@angular/core';
import { Email } from '../models/email';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  refreshPage = new EventEmitter();
  showEmail = new EventEmitter<Email>();
  restoreEmail = new EventEmitter<Email>();
  moveEmailToTrash = new EventEmitter<Email>();
  deleteEmail = new EventEmitter<Email>();
  showComposeEmailModal = new EventEmitter();

  constructor() { }
}
