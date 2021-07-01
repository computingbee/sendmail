import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComponentsRefreshService {
    private subj = new Subject<any>();

    sendMessage(message: string) {
        this.subj.next({ text: message });
    }

    clearMessage() {
        this.subj.next();
    }

    getMessage(): Observable<any> {
        return this.subj.asObservable();
    }
}