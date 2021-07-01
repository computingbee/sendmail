import { HttpEventType, HttpResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Email } from 'src/app/models/email';
import { EmailService } from 'src/app/services/email.service';

import { NgForm } from '@angular/forms';

import { ComponentsRefreshService } from 'src/app/services/components.refresh.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-email-submit',
  templateUrl: './email-submit.component.html',
  styleUrls: ['./email-submit.component.scss']
})
export class EmailSubmitComponent implements OnInit, AfterViewInit {

  email: Email = {
    _id: '',
    clientIP: '',
    //from: 'no-reply-patient-info@carebmc.com',
    from: environment.defaultFromEmailAddress,
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    message: '',
    attachments: [],
    sent: false
  };

  files: any[] = [];
  submitted = false;
  emailSent = false;

  envInfo: any;

  @ViewChild("fileValidationMessages", { static: true }) fileValidationMessages: ElementRef;

  constructor(private emailService: EmailService, private componentRefreshService: ComponentsRefreshService) { 
    
  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    //console.log(window.location.origin);
    this.envInfo = environment;

    this.emailService.relaymailservice()
      .subscribe(
        response => {
        },
        error => {
          console.log(error);
          const cls = ["alert", "alert-danger", "fileValidationMessages"]
          this.fileValidationMessages.nativeElement.classList.add(...cls);
          this.fileValidationMessages.nativeElement.innerText += 
            `\n\nERROR: Email Relay Service Not Available!\nStatus Code: ${error.status}\nStatus: ${error.statusText}\nAPI Host: ${error.url}\nMessage: ${error.message}`;
        }
      );

      this.emailService.uploaddownloadfileservice()
      .subscribe(
        response => {
        },
        error => {
          console.log(error);
          const cls = ["alert", "alert-danger", "fileValidationMessages"]
          this.fileValidationMessages.nativeElement.classList.add(...cls);
          this.fileValidationMessages.nativeElement.innerText += 
            `\n\nERROR: File Upload Service Not Available!\nStatus Code: ${error.status}\nStatus: ${error.statusText}\nAPI Host: ${error.url}\nMessage: ${error.message}`;
        }
      );
  }



  ngOnDestroy() {

  }
  /**
 * on file drop handler
 */
  onFileDropped($event: any[]) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any[]) {

    this.prepareFilesList(files);

  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    const cls = ["alert", "alert-danger", "alert-info", "fileValidationMessages"]
    this.fileValidationMessages.nativeElement.classList.remove(...cls);
    this.fileValidationMessages.nativeElement.innerText = "";
    this.files.splice(index, 1);
  }
  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    var loadedSoFar = 0;
    const cls = ["alert", "alert-danger", "alert-info", "fileValidationMessages"];
    this.fileValidationMessages.nativeElement.classList.remove(...cls);
    this.fileValidationMessages.nativeElement.innerText = "";
    setTimeout(() => {
      if (index === this.files.length || this.files[index] === null || this.files[index] === undefined) {
        //console.log(this.files[index].name);
        return;
      } else {
        //console.log("else: " + this.files[index].name);
        const progressInterval = setInterval(() => {
          if (this.files[index] === null || this.files[index] === undefined) {
            return;
          }
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {

            //if (this.files[index].size > (25 * 1024 * 1024)) {
              if (this.files[index].size > (environment.attachmentMaxSizeInMB * 1024 * 1024)) {
              const cls = ["alert", "alert-danger", "fileValidationMessages"]
              this.fileValidationMessages.nativeElement.classList.add(...cls);
              this.fileValidationMessages.nativeElement.innerText = this.files[index].name + " is more than " + environment.attachmentMaxSizeInMB + "MB. Please remove this file.";
              return;
            } else if (!this.files[index].type.match(environment.attachmentAllowedFileTypes)) { 
            //else if (!this.files[index].type.match("pdf|plain|png|jpeg|gif|tiff|officedocument|msword|excel|rtf|zip")) {
              const cls = ["alert", "alert-danger", "fileValidationMessages"]
              this.fileValidationMessages.nativeElement.classList.add(...cls);
              this.fileValidationMessages.nativeElement.innerText = this.files[index].name + " is not a valid attachment file type. Please remove this file.";
              return;
            } else {
              this.emailService.upload(this.files[index]).subscribe(
                (event: any) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    if (event.loaded > event.total) {
                    console.log(event.loaded + " of " + event.total );
                    }

                    //if (event.lengthComputable) {
                      //loadedSoFar += event.loaded;
                      //console.log("loadedSoFar: " + loadedSoFar);
                      //console.log("loadedSoFar: " + event.total);
                      this.files[index].progress = Math.round((event.loaded/event.total) * 100);
                    //}
                  } else if (event instanceof HttpResponse) {
                    return;
                  }
                },
                (err: any) => {
                  this.files[index].progress = 0;
                }
              );
              //console.log("file uploaded: " + this.files[index].name);
              //this.files[index].progress += 5;
            }
          }
        }, 200);
      }
    }, 500);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    this.fileValidationMessages.nativeElement.classList.remove("alert");
    this.fileValidationMessages.nativeElement.classList.remove("alert-danger");
    this.fileValidationMessages.nativeElement.innerText = "";
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals: number, fname: String) {

    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];

  }

  sendMessage(): void {
    this.componentRefreshService.sendMessage('ReloadYourselfPlease');
  }

  clearMessage(): void {
    this.componentRefreshService.clearMessage();
  }

  onSubmit(emailSubmitForm: NgForm) {

    if (this.files.length == 0) {

      this.fileValidationMessages.nativeElement.classList.add("alert");
      this.fileValidationMessages.nativeElement.classList.add("alert-danger");
      this.fileValidationMessages.nativeElement.innerText = "Please upload at least one file to attach!";

    } else if (this.files.length > environment.attachmentMaxFileCount) {
    //else if (this.files.length > 10) {

      this.fileValidationMessages.nativeElement.classList.add("alert");
      this.fileValidationMessages.nativeElement.classList.add("alert-danger");
      this.fileValidationMessages.nativeElement.innerText = "Maximum of " + environment.attachmentMaxFileCount + " file attachments are allowed per email. Please delete some files";

    } else {

      var filenames = [];
      this.files.forEach(element => {
        filenames.push(element.name);
      });

      this.email.attachments = filenames;

      this.emailService.relay(this.email).subscribe({
        next: data => {
          if (data.sent === true) {
            //console.log(data);
            this.fileValidationMessages.nativeElement.classList.add("alert");
            this.fileValidationMessages.nativeElement.classList.add("alert-success");
            this.fileValidationMessages.nativeElement.innerText = "Email was successfuly relayed.";

          } else {
            this.fileValidationMessages.nativeElement.classList.add("alert");
            this.fileValidationMessages.nativeElement.classList.add("alert-danger");
            this.fileValidationMessages.nativeElement.innerHTML = "ERROR: Email not relayed or history created!!!<br/> Message ID: " + data._id;
          }
        },
        error: err => {
          this.fileValidationMessages.nativeElement.classList.add("alert");
          this.fileValidationMessages.nativeElement.classList.add("alert-danger");
          this.fileValidationMessages.nativeElement.innerHTML = "ERROR: Unable to relay email !!!<br/>Error Details:<br/>" + err.message;
        }
      });

      this.submitted = true;
      emailSubmitForm.resetForm();
      this.files = [];
      this.email = {
        _id: '',
        clientIP: '',
        //from: 'no-reply-patient-info@carebmc.com',
        from: environment.defaultFromEmailAddress,
        to: [],
        cc: [],
        bcc: [],
        subject: '',
        message: '',
        attachments: [],
        sent: false
      };
      this.sendMessage();
    }
  }
}
