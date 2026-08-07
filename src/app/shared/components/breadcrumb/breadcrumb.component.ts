import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  ActivatedRoute
} from '@angular/router';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {

  breadcrumbs: any[] = [];

  today = new Date();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        this.breadcrumbs = [];

        let currentRoute = this.route.root;

        let url = '';

        while (currentRoute.firstChild) {

          currentRoute = currentRoute.firstChild;

          const routeURL = currentRoute.snapshot.url
            .map(segment => segment.path)
            .join('/');

          if (routeURL) {

            url += `/${routeURL}`;

            this.breadcrumbs.push({

              label: this.formatLabel(routeURL),

              url: url

            });

          }

        }

      });

  }

  private formatLabel(text: string): string {

    return text
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

  }

}