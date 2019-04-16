import { Injectable } from '@angular/core';
import { UUID } from '../document/command/document-command.service';
import { Router, NavigationStart } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class VersionService {

  private myVersions: Set<UUID> = new Set();
  private isRouterSubscriptionReady = false;

  constructor(private router: Router) { }

  registerVersion(version: UUID) {
    this.myVersions.add(version);

    if (!this.isRouterSubscriptionReady) {
      this.subscribeToRouter();
      this.isRouterSubscriptionReady = true;
    }
  }

  private subscribeToRouter() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        // Reset the stored versions when navigating to another document
        this.myVersions.clear();
      }
    });
  }

  isRegistered(version: UUID): boolean {
    const doesExist: boolean = this.myVersions.has(version);

    return doesExist;
  }
}
