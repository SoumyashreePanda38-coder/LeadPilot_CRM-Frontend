import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  show(): void {
    console.log('🔵 GLOBAL LOADER SHOW');
    console.trace();
    this.loadingSubject.next(true);
  }

  hide(): void {
    console.log('🟢 GLOBAL LOADER HIDE');
    console.trace();
    this.loadingSubject.next(false);
  }
}