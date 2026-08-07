import { Component, input, InputSignal } from '@angular/core';
import { CollectionItem } from '../../models/collection-item';

@Component({
  selector: 'app-collection-item-card',
  imports: [],
  templateUrl: './collection-item-card.html',
  styleUrl: './collection-item-card.css',
})
export class CollectionItemCard {

  item = input.required<CollectionItem>();
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
}
