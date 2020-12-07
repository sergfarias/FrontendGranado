import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MediaChange } from '@angular/flex-layout'; 
import { MediaObserver } from '@angular/flex-layout';

@Injectable()
export class MediaReplayService {

  constructor(media: MediaObserver) {
    media.asObservable()
      .subscribe(res => this.media$, err => this._media$.error(err), () => this._media$.complete());
  }

  private _media$: ReplaySubject<MediaChange> = new ReplaySubject(1);

  get media$(): Observable<MediaChange> {
    return this._media$.asObservable();
  }

}
