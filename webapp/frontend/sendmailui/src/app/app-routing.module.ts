import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { EmailSubmitComponent } from './components/email-submit/email-submit.component';
import { EmailsListComponent } from './components/emails-list/emails-list.component';

const routes: Routes = [
  { path: '', component: AppComponent, pathMatch: 'full' },
  { path: 'emails', component: EmailsListComponent },
  { path: 'submit', component: EmailSubmitComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
