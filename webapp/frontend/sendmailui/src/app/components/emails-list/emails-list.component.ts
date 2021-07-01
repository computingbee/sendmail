import { Component, OnInit, OnDestroy, DoCheck} from '@angular/core';

import { Email } from 'src/app/models/email';
import { EmailService } from 'src/app/services/email.service';

import { Subscription } from 'rxjs';
import { ComponentsRefreshService } from 'src/app/services/components.refresh.service';
import { ThrowStmt } from '@angular/compiler';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-emails-list',
  templateUrl: './emails-list.component.html',
  styleUrls: ['./emails-list.component.css']
})
export class EmailsListComponent implements OnInit, OnDestroy, DoCheck {

  envInfo: any;
  
  emails: Email[] = [];
  currentEmail?: Email;
  currentIndex = -1;

  page = 1;
  count = 0;
  pageSize = environment.defaultPageSize;
  pageSizes = environment.defaultPageSizes;
  //pageSize = 3;
  //pageSizes = [3, 6, 9];

  compRefreshMessage: any;
  private compRefreshSubscription: Subscription;

  constructor(private emailService: EmailService, private componentRefreshService: ComponentsRefreshService) {

    this.compRefreshSubscription = this.componentRefreshService.getMessage()
      .subscribe(message => {
        this.compRefreshMessage = message;
      });
  }

  ngOnInit(): void {
    this.envInfo = environment;
    this.retrieveEmails();
  }

  emailsRetreived: Boolean
  
  wait(ms:number) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }

  ngDoCheck() {
    if (this.compRefreshMessage != null && this.compRefreshMessage.text === 'ReloadYourselfPlease') {
      //console.log("compRefreshMessage");
      this.page = 1;
      this.retrieveEmails();
      this.wait(300);
      if (this.emailsRetreived == true) {
        //console.log("emailsRetreived");
        this.componentRefreshService.clearMessage();
      }
    }
    this.emailsRetreived = false;
  }

  ngOnDestroy() {
    this.compRefreshSubscription.unsubscribe();
  }

  getRequestParams(page: number, pageSize: number): any {

    let params: any = {};

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  retrieveEmails(): void {

    const params = this.getRequestParams(this.page, this.pageSize);

    //console.log(params);

    this.emailService.history(params)
      .subscribe(
        response => {
          const { emails, totalItems } = response;
          this.emails = emails;
          this.count = totalItems;

          if (this.compRefreshMessage != null && this.compRefreshMessage.text === 'ReloadYourselfPlease') {
              this.emailsRetreived = true;
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveEmails();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveEmails();

  }

  showEmailDetails(sID: any): void {
    //var sID = event.target.id;
    //console.log(sID);
    //console.log(document.getElementById(sID + "spanID"));
    if ( document.getElementById(sID + "spanID").classList.contains("glyphicon-plus") ) {
      document.getElementById(sID + "spanID").classList.replace("glyphicon-plus","glyphicon-minus");
      document.getElementById(sID + "tableID").classList.replace("emailDetailsHide","emailDetailsShow");
    } else {
      document.getElementById(sID + "spanID").classList.replace("glyphicon-minus","glyphicon-plus");
      document.getElementById(sID + "tableID").classList.replace("emailDetailsShow","emailDetailsHide");
    }

  }
}
