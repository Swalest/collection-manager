import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from '@angular/core';
import { CollectionItem } from '../../models/collection-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection-item-card',
  imports: [],
  templateUrl: './collection-item-card.html',
  styleUrl: './collection-item-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionItemCard {

  item = input.required<CollectionItem>();
  private router = inject(Router);
  /*
  item: InputSignal<CollectionItem> = input.required<CollectionItem>({
    alias: 'collection-item'
  });
  */

  /*
  item: InputSignal<CollectionItem> = input.required<CollectionItem, CollectionItem>({
            alias: 'collection-item',
            transform: (collectionItem) => {
              collectionItem.price = collectionItem.price * 1.17;
              return collectionItem;
            }
          });
          */

  onDetail(itemId: number){
    if(itemId)
      this.router.navigate(['item', itemId]);
    else this.router.navigate(['not-found']);
  }
}
