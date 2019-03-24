import { Component, OnInit } from '@angular/core';
import { NavigationBarService } from '../../services/navigation-bar/navigation-bar.service';
import { NavigationTabDocument } from '../../classes/navigation-tab';
import { slideLeftToRightAnimation, fadeInOutAnimation } from 'src/app/animation';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  animations: [slideLeftToRightAnimation, fadeInOutAnimation]
})
export class NavigationBarComponent implements OnInit {

  isNavigationTabShown = false;
  navigationTabs: NavigationTabDocument[] = [];
  constructor(
    private navigationBarService: NavigationBarService,
  ) { }

  ngOnInit() {
    this.navigationBarService.getNavigationBarStatus$().subscribe(status => {
      this.isNavigationTabShown = status;
    });
    this.navigationBarService.getNavigationBar$().subscribe((navigationTabs: NavigationTabDocument[]) => {
      for (const navigationTab of navigationTabs) {
        this.navigationTabs.push(navigationTab);
      }
    });
  }

}
