import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { CollectionService } from '../../services/collection-service';
import { CollectionItem } from '../../models/collection-item';
import { Collection } from '../../models/collection';
import { CollectionItemCard } from '../../components/collection-item-card/collection-item-card';
import { SearchBar } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-collection-detail',
  imports: [
      CollectionItemCard,
      SearchBar
    ],
  templateUrl: './collection-detail.html',
  styleUrl: './collection-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionDetail {
  private collectionService = inject(CollectionService);

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
    const collection = this.selectedCollection();
    if(collection){
      const storedCollection = this.collectionService.addItem(collection, new CollectionItem());
      this.selectedCollection.set(storedCollection);
    }
  }
}
