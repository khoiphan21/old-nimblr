import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../classes/user';
import { AccountService } from '../../services/account/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() currentUser: User;

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit() {
    // this.accountService.getUser$().subscribe((user) => {
    //   this.currentUser = user;
    // });
  }

}
