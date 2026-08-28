import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddToFolderComponent } from './components/add-to-folder/add-to-folder.component';
import { AttachmentsListComponent } from './components/attachments-list/attachments-list.component';
import { ComposeComponent } from './components/compose/compose.component';
import { DraftsComponent } from './components/drafts/drafts.component';
import { EmailViewComponent } from './components/email-view/email-view.component';
import { EmailsTableComponent } from './components/emails-table/emails-table.component';
import { FolderComponent } from './components/folder/folder.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FoldersComponent } from './components/folders/folders.component';
import { HeaderComponent } from './components/header/header.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { LoginComponent } from './components/login/login.component';
import { MailComponent } from './components/mail/mail.component';
import { SearchComponent } from './components/search/search.component';
import { SentComponent } from './components/sent/sent.component';
import { SignupComponent } from './components/signup/signup.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TrashComponent } from './components/trash/trash.component';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
	declarations: [
		AddToFolderComponent,
		AppComponent,
		AttachmentsListComponent,
		ComposeComponent,
		DraftsComponent,
		EmailViewComponent,
		EmailsTableComponent,
		FileUploadComponent,
		FolderComponent,
		FoldersComponent,
		HeaderComponent,
		InboxComponent,
		LoginComponent,
		MailComponent,
		SearchComponent,
		SentComponent,
		SignupComponent,
		SidenavComponent,
		TrashComponent,
	],
	imports: [
		AppRoutingModule,
		BrowserAnimationsModule,
		BrowserModule,
		ButtonModule,
		CalendarModule,
		ConfirmDialogModule,
		DialogModule,
		DropdownModule,
		HttpClientModule,
		InputTextareaModule,
		InputTextModule,
		OverlayPanelModule,
		PaginatorModule,
		ProgressBarModule,
		ReactiveFormsModule,
		RippleModule,
		TableModule,
		ToastModule,
		FontAwesomeModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
