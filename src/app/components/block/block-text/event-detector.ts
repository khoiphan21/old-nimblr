import { Output, EventEmitter } from '@angular/core';

export class EventDetector {
    /** Register all the keyboard event here. This class is use for
     * mapping a special keyboard events to special actions. Eg: press
     * "-" then " " to trigger a bulletpoint. All these rules r defined 
     * here so the component would not need top know how its been triggered.
     */
    // TODO: @Bruno not impl class
    
    previousValidKey: [];
    constructor() { }

    detectEvent(event: KeyboardEvent) { 
        // TODO: @Bruno not impl

    }

    private createTextBlockOnEnter() {
        // Create new line (block)



        this.clearAction();
    }

    private onBackSpaceAndEmptyTextbox() {
        // Delete text block



        this.clearAction();
    }

    private addBulletPoint() {
        // Add bullet point



        this.clearAction();
    }

    private deleteBulletPoint() {
        // Delete bullet point



        this.clearAction();
    }

    private neglect() {
        // No action
        this.clearAction();
    }

    private clearAction() {
        this.previousValidKey = [];
    }
}
