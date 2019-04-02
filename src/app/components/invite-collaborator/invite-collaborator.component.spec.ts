import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteCollaboratorComponent } from './invite-collaborator.component';
import { ResponsiveModule } from 'ngx-responsive';

describe('InviteCollaboratorComponent', () => {
  let component: InviteCollaboratorComponent;
  let fixture: ComponentFixture<InviteCollaboratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteCollaboratorComponent ],
      imports: [
        ResponsiveModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteCollaboratorComponent);
    component = fixture.componentInstance;
    component.isInviteCollaboratorShown = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hideContainer() - should change the value to false', () => {
      component.hideInviteCollaborateEvent.subscribe(data => {
        expect(data).toBe(false);
      });
      component.hideContainer();
  });
});
