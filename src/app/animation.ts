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

export const slideLeftToRightAnimation = trigger(
    'slideLeftToRightAnimation', [
        transition(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('150ms', style({ transform: 'translateX(0)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateX(0)' }),
            animate('150ms', style({ transform: 'translateX(-100%)' }))
        ])
    ]
);

export const slideBottomToTopAnimation = trigger(
    'slideBottomToTopAnimation', [
        transition(':enter', [
            style({ transform: 'translateY(100%)' }),
            animate('150ms', style({ transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateY(0)' }),
            animate('150ms', style({ transform: 'translateY(100%)' }))
        ])
    ]
);

