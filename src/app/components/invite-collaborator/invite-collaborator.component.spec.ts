import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteCollaboratorComponent } from './invite-collaborator.component';

describe('InviteCollaboratorComponent', () => {
  let component: InviteCollaboratorComponent;
  let fixture: ComponentFixture<InviteCollaboratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteCollaboratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
