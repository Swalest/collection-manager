import { ChangeDetectionStrategy, Component, computed, effect, inject, model, signal } from '@angular/core';
import { CollectionItemCard } from './components/collection-item-card/collection-item-card';
import { CollectionItem } from './models/collection-item';
import { SearchBar } from './components/search-bar/search-bar';
import { Collection } from './models/collection';
import { CollectionService } from './services/collection-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [
    CollectionItemCard,
    SearchBar
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {

  private collectionService = inject(CollectionService);

  search = model<string>('');

  linx!: CollectionItem;
  coin!: CollectionItem;
  stamp!: CollectionItem;

  selectedCollection = signal<Collection | null>(null);
  collectionItems = computed(() => {
    const allItems = this.selectedCollection()?.items;
    if(!this.search()){
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
