import { Component, OnInit } from '@angular/core';
import { NavigationBarService } from '../../services/navigation-bar/navigation-bar.service';
import { NavigationTabDocument } from '../../classes/navigation-tab';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  navigationTabs: NavigationTabDocument[] = [];
  constructor(
    private navigationBarService: NavigationBarService,
  ) { }

  ngOnInit() {
    this.navigationBarService.getNavigationBar$().subscribe((navigationTabs: NavigationTabDocument[]) => {
      for (const navigationTab of navigationTabs) {
        this.navigationTabs.push(navigationTab);
      }
    });
  }

}
