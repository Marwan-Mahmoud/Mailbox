import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  queryParams: Observable<Params> | undefined;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.queryParams = this.route.queryParams;
  }
}
