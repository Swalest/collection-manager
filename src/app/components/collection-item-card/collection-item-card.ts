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

  onDetail(itemId: number){
    if(itemId)
      this.router.navigate(['item', itemId]);
    else this.router.navigate(['not-found']);
  }
}
