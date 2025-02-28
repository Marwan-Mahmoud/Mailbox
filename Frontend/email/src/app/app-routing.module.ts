import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SentComponent } from './components/sent/sent.component';
import { DraftsComponent } from './components/drafts/drafts.component';
import { TrashComponent } from './components/trash/trash.component';
import { FoldersComponent } from './components/folders/folders.component';
import { MailComponent } from './components/mail/mail.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { SignupComponent } from './components/signup/signup.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'mail',
    component: MailComponent,
    children: [
      { path: '', redirectTo: 'inbox', pathMatch: 'full' },
      { path: 'inbox', component: InboxComponent },
      { path: 'sent', component: SentComponent },
      { path: 'drafts', component: DraftsComponent },
      { path: 'trash', component: TrashComponent },
      { path: 'folders', component: FoldersComponent },
      { path: 'search', component: SearchComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
