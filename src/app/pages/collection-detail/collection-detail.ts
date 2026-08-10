import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { CollectionService } from '../../services/collection-service';
import { CollectionItem } from '../../models/collection-item';
import { Collection } from '../../models/collection';
import { CollectionItemCard } from '../../components/collection-item-card/collection-item-card';
import { SearchBar } from '../../components/search-bar/search-bar';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-collection-detail',
  imports: [
      CollectionItemCard,
      SearchBar, MatButtonModule
    ],
  templateUrl: './collection-detail.html',
  styleUrl: './collection-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionDetail {
  private collectionService = inject(CollectionService);
  private router = inject(Router);

  search = model<string>('');

  linx!: CollectionItem;
  coin!: CollectionItem;
  stamp!: CollectionItem;

  selectedCollection = signal<Collection | null>(null);
  collectionItems = computed(() => {
    const allItems = this.selectedCollection()?.items;
    if(!this.search()){
      console.log(`${JSON.stringify(allItems, null, 2)}`);
      return allItems;
    }else {
      return allItems?.filter(item => 
        item.name.toLowerCase().includes(
          this.search().toLowerCase())
      );
    }
  });

  constructor() {
    const allCollections = this.collectionService.getAll();
    if(allCollections.length > 0){
      this.selectedCollection.set(allCollections[0]);
    }
  }

  addGenericItem(){
    this.router.navigate(['item']);
  }
}
