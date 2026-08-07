import { ChangeDetectionStrategy, Component, computed, effect, model, signal } from '@angular/core';
import { CollectionItemCard } from './components/collection-item-card/collection-item-card';
import { CollectionItem } from './models/collection-item';
import { SearchBar } from './components/search-bar/search-bar';
import { Collection } from './models/collection';

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
  search = model<string>('timbre');

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
    this.coin = new CollectionItem();
    this.coin.name = 'Pièce de 1972';
    this.coin.description = 'Pièce de 50 centimes de francs.';
    this.coin.rarity = 'Commune';
    this.coin.img = 'img/coin1.jpg';
    this.coin.price = 175;

    this.linx = new CollectionItem();

    this.stamp = new CollectionItem();
    this.stamp.name = 'vieux timbre';
    this.stamp.description = 'un vieux timbre.';
    this.stamp.rarity = 'Rare';
    this.stamp.img = 'img/timbre1.jpg';
    this.stamp.price = 555;
    
    const defaultCollection = new Collection();
    defaultCollection.title = "Default Collection'";
    defaultCollection.items = [
      this.coin,
      this.linx,
      this.stamp
    ]
    this.selectedCollection.set(defaultCollection);
  }
}
