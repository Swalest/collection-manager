import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-collection-item-detail',
  imports: [RouterLink],
  templateUrl: './collection-item-detail.html',
  styleUrl: './collection-item-detail.css',
})
export class CollectionItemDetail/* implements OnInit, OnDestroy */{
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  //itemId = signal<number | null>(null);
  //routeSubscription: Subscription | null = null;
  //id = input<string | null>(null);
  itemId = input<number | null, string | null>(null, {
    alias: 'id',
    transform: value => value ? parseInt(value) : null
  });

  /*
  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.params.subscribe(
      (params) => {
        const selectedId = params['id'] ? parseInt(params['id']) : null;
        this.itemId.set(selectedId);
      }
    );
  }
    */

  /*
  next(){
    const currentId = this.itemId();
    if(currentId){
      const nextId = currentId + 1;
      this.router.navigate(['item', nextId]); // -> /home/id+1
    }
  }
  */

  /*
  ngOnDestroy(): void {
    if(this.routeSubscription)
      this.routeSubscription.unsubscribe(); 
  }
    */
}
