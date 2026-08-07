import { Injectable } from '@angular/core';
import { Collection } from '../models/collection';
import { CollectionItem } from '../models/collection-item';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private collections: Collection[] = [];
  private currentId = 1;
  private currentItemIndex: {[key: number]: number} = {};

   constructor() {
    this.load();
  }

  private save(){
    localStorage.setItem('collection', JSON.stringify(this.collections));
  }

  private load(){
    const collectionJson = localStorage.getItem('collections');
    if(collectionJson){
      this.collections = JSON.parse(collectionJson).map((collectionJson: any) =>{
        const collection = Object.assign(new Collection(), collectionJson);
        const itemsJson = collectionJson['items'] || [];
        collection.items = itemsJson.map((item: any) => Object.assign(new Collection()));
        return collection;
      });

      this.currentId = Math.max(...this.collections.map(Collection => Collection.id));
      this.collections.reduce(
        (indexes: {[key: number]: number}, collection) =>{
          indexes[collection.id] = Math.max(...collection.items.map(item => item.id))
          return indexes;
        }, {}
      );
    }else {
      this.generateDummyData();
      this.save();
    }
  }

  generateDummyData(){
    const coin = new CollectionItem();
    coin.name = 'Pièce de 1972';
    coin.description = 'Pièce de 50 centimes de francs.';
    coin.rarity = 'Commune';
    coin.img = 'img/coin1.jpg';
    coin.price = 175;
    
    const stamp = new CollectionItem();
    stamp.name = 'vieux timbre';
    stamp.description = 'un vieux timbre.';
    stamp.rarity = 'Rare';
    stamp.img = 'img/timbre1.jpg';
    stamp.price = 555;
    
    const linx = new CollectionItem();
        
    const defaultCollection = new Collection();
    defaultCollection.title = "Collection mix";

    const storedCollection = this.add(defaultCollection);
    this.addItem(storedCollection, coin);
    this.addItem(storedCollection, stamp);
    this.addItem(storedCollection, linx);
  }

  getAll(): Collection[]{
    return this.collections.map(collection => collection.copy());
  }

  getOne(collectionId: number): Collection | null {
    const storedCopy = this.collections.find( collection => collection.id === collectionId);
    
    if(!storedCopy) return null;
    return storedCopy;
  }

  add(collection: Omit<Collection, 'id' | 'items'>): Collection{
    const storedCopy = collection.copy();
    storedCopy.id = this.currentId;
    this.collections.push(storedCopy);

    this.currentItemIndex[storedCopy.id] = 1;
    this.currentId++;
    this.save();

    return storedCopy.copy();
  }

  update(updatedCollection: Omit<Collection,'items'>): Collection | null {
    const storedCopy = this.collections.find(collection => collection.id === updatedCollection.id);

    if(!storedCopy) return null;

    Object.assign(storedCopy, updatedCollection);
    this.save();
    return storedCopy.copy();
  }

  delete(collectionId: number): void {
    this.collections = this.collections.filter(collection => collection.id !== collectionId);
    this.save();
  }

  addItem(collection: Collection, item: CollectionItem): Collection | null {
    const storedCollection = this.collections.find(
      instanceCollection => instanceCollection.id === collection.id
    );

    if(!storedCollection) return null;
    let storedItemIndex = 0;
    if(storedCollection.items.length > 0)
      storedItemIndex = storedCollection.items.findIndex(storedItem => storedItem.id === item.id);

    if(storedItemIndex === -1) return null;
    storedCollection.items.push(item.copy());
    this.save();

    return storedCollection.copy();
  }

  deleteItem(collectionId: number, itemId: number): Collection | null {
    const storedCollection = this.collections.find(collection => collection.id == collectionId);
    if(!storedCollection) return null;

    storedCollection.items.filter(item => item.id !== itemId);
    this.save();

    return storedCollection.copy();
  }
}
