// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  apiEmailRelayServiceHost: "https://sendmail.carebmc.com:6084/api/relaymail",
  apiUpDownloadFileServiceHost: "https://sendmail.carebmc.com:6082",
  attachmentMaxSizeInMB: 25,
  attachmentMaxFileCount: 5,
  attachmentAllowedFileTypes: "pdf|plain|png|jpeg|gif|tiff|officedocument|msword|excel|rtf|zip",
  attachmentAllowedFileTypesInfoMessage: "PDF, Text, Images, ZIP Archive, &amp; Office Documents",
  defaultFromEmailAddress: "DoNotReply@carebmc.com",
  FromEmailAddressList: ["no-reply-patient-info@carebmc.com", "no-reply-contact-info@carebmc.com", "noreply@carebmc.com", "DoNotReply@carebmc.com"],
  defaultPageSize: 3,
  defaultPageSizes: [3,6,9]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
