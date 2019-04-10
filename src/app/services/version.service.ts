import { Injectable } from '@angular/core';
import { UUID } from './document/command/document-command.service';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  private myVersions: Set<UUID> = new Set();

  constructor() { }

  registerVersion(version: UUID) {
    this.myVersions.add(version);
  }

  checkAndDelete(version: UUID): boolean {
    const doesExist: boolean = this.myVersions.has(version);

    if (doesExist) {
      // now delete the stored version
      this.myVersions.delete(version);
    }
    return doesExist;
  }
}
