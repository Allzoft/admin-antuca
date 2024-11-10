import { Injectable } from '@angular/core';
import { Observable, fromEvent, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap,
} from 'rxjs/operators';

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  state: LayoutState = {
    staticMenuDesktopInactive: true,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  };

  private overlayOpen = new Subject<any>();

  overlayOpen$: Observable<any> = this.overlayOpen.asObservable();
  private isMobileValue: boolean = false;

  constructor() {
    this.setupResponsiveChecks();
  }

  private setupResponsiveChecks(): void {
    const isMobile$ = fromEvent(window, 'resize').pipe(
      map(() => window.innerWidth <= 991),
      startWith(window.innerWidth <= 991),
      distinctUntilChanged(),
      debounceTime(300),
      tap((isMobile) => {
        this.isMobileValue = isMobile;
        if (this.isMobile()) {
          this.state.staticMenuDesktopInactive = false;
        } else {
          this.state.staticMenuDesktopInactive = true;
        }
      })
    );

    isMobile$.subscribe();
  }

  isMobile(): boolean {
    return this.isMobileValue;
  }

  onMenuToggle() {
    if (!this.isMobile()) {
      this.state.staticMenuDesktopInactive =
        !this.state.staticMenuDesktopInactive;
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;
      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  onOverlaySubmenuOpen() {
    this.overlayOpen.next(null);
  }
}
