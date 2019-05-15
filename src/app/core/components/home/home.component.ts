import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  routerSubscription: Subscription;
  categoryType;
  constructor(private router: ActivatedRoute) {
  }

  ngOnInit() {
    this.router.queryParamMap.subscribe(queryParams => this.categoryType = queryParams.get('category'));
  }

  ngOnDestroy() {
    if (this.routerSubscription)
      this.routerSubscription.unsubscribe();
  }

}
