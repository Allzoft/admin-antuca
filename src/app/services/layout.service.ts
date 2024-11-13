import { Injectable } from '@angular/core';
import { Observable, fromEvent, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  take,
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
    staticMenuDesktopInactive: false,
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
      // debounceTime(300),
      tap((isMobile) => {
        this.isMobileValue = isMobile;
      })
    );
  
    // Ejecuta la lógica una vez, después de que se haya evaluado `isMobile`
    isMobile$.pipe(take(1)).subscribe(() => {
      if (!this.isMobileValue) {
        this.state.staticMenuDesktopInactive = true;
      }
    });
    
    // Luego continúa la suscripción normalmente para cambios futuros
    isMobile$.subscribe();
  }

  isMobile(): boolean {
    return this.isMobileValue;
  }

  onMenuToggle() {
    this.state.staticMenuDesktopInactive =
      !this.state.staticMenuDesktopInactive;
    // if (!this.isMobile()) {
    //   this.state.staticMenuDesktopInactive =
    //     !this.state.staticMenuDesktopInactive;
    // } else {
    //   this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;
    //   if (this.state.staticMenuMobileActive) {
    //     this.overlayOpen.next(null);
    //   }
    // }
  }

  onOverlaySubmenuOpen() {
    this.overlayOpen.next(null);
  }
}
