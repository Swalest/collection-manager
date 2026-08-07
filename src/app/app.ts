import { Component, signal } from '@angular/core';
import { CollectionItemCard } from './components/collection-item-card/collection-item-card';
import { CollectionItem } from './models/collection-item';
import { SearchBar } from './components/search-bar/search-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [
    CollectionItemCard,
    SearchBar
  ]
})
export class App {
  linx!: CollectionItem;
  coin!: CollectionItem;
  count: number = 0;
  searchText: string = '';

  constructor() {
    this.coin = new CollectionItem();
    this.coin.name = 'Pièce de 1972';
    this.coin.description = 'Pièce de 50 centimes de francs.';
    this.coin.rarity = 'Commune';
    this.coin.img = 'img/coin1.jpg';
    this.coin.price = 175;

    this.linx = new CollectionItem();
  }

  incrementCount() {
    this.count++;
  }
}
