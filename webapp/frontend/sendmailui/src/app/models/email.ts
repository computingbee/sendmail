export class Email {
    _id?: string;
    clientIP?: string;
    from?: string;
    to?: string[];
    cc?: string[];
    bcc?: string[];
    subject?: string;
    message?: string;
    attachments?: string[];
    sent?: boolean;
}
