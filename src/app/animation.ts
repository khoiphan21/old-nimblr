import { trigger, style, animate, transition } from '@angular/animations';

export const fadeInOutAnimation = trigger(
    'fadeInOutAnimation', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('100ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            style({ opacity: 1 }),
            animate('100ms', style({ opacity: 0 }))
        ])
    ]
);
