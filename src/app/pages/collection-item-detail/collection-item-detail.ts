import { Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollectionItem, Rarities, Rarity } from '../../models/collection-item';
import { CollectionItemCard } from '../../components/collection-item-card/collection-item-card';
import { Router } from '@angular/router';
import { CollectionService } from '../../services/collection-service';
import { Collection } from '../../models/collection';
import { Subscription } from 'rxjs';
//import { form, FormField, required } from '@angular/forms/signals';

@Component({
  selector: 'app-collection-item-detail',
  imports: [/*FormField,*/ ReactiveFormsModule, CollectionItemCard],
  templateUrl: './collection-item-detail.html',
  styleUrl: './collection-item-detail.css',
})
export class CollectionItemDetail implements OnDestroy {
  /*
  formModel = signal({
    'name': ''
  });

  testForm = form(this.formModel, (schemaPath) =>{
    required(schemaPath.name, { message: 'Name is required !'});
  });
  */

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private collectionService = inject(CollectionService)

  readonly rarities = Object.values(Rarities);
  

  itemId = input<number | null, string | null>(null, {
        alias: 'id',
        transform: (id: string | null) => id ? parseInt(id) : null
      });

  selectedCollection!: Collection;
  collectionItem = signal<CollectionItem>(new CollectionItem());

  valueChangeSubscription: Subscription | null = null;

  /*
  itemFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    rarity: new FormControl(Rarities.Common, [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0)])
  });
  */
 itemFormGroup = this.fb.group({
    name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['', [Validators.required]],
      rarity: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]]
  });

  constructor() {
    effect(() =>{
      let itemToDisplay = new CollectionItem();
      this.selectedCollection = this.collectionService.getAll()[0];
      if(this.itemId()){
        const itemFound = this.selectedCollection.items.find(item => item.id === this.itemId());
        if(itemFound)
          itemToDisplay = itemFound;
        else this.router.navigate(['not-found']);
      }
      this.itemFormGroup.patchValue(itemToDisplay);
    });

    this.valueChangeSubscription = this.itemFormGroup.valueChanges.subscribe(
      () =>{
        this.collectionItem.set(
          Object.assign(new CollectionItem(), this.itemFormGroup.value)
        );
      }
    )
  }

  //nameFormControl = new FormControl('', [Validators.required]);
  //priceFormControl = new FormControl(0, [Validators.required, Validators.min(0)]);

  submit(event: Event){
    event.preventDefault();
    //console.log(`Values of our form: ${JSON.stringify(this.testForm().value(), null, 2)}`);
    //console.log(`The value of our name: ${this.nameFormControl.value}`)
    //console.log(`The value of our price: ${this.priceFormControl.value}`)
    console.log(this.itemFormGroup.value)
  }

  /*
  setName(){
    this.nameFormControl.setValue('Change Me')
  }
  */

  isFieldValid(fieldName: string){
    const formControl = this.itemFormGroup.get(fieldName);
    return formControl?.invalid && (formControl?.dirty || formControl.touched)
  }

  onFileChange(event: any){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length){
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () =>{
        this.itemFormGroup.patchValue({image: reader.result as string});
      }
    }
  }

  ngOnDestroy(): void {
    this.valueChangeSubscription?.unsubscribe();
  }

  onAdd(): Collection {
    const maxId: number = this.selectedCollection.items.length > 0
            ? Math.max(...this.selectedCollection.items.map(item => item.id)) : 0;
    const name = this.itemFormGroup.get('name')?.value;
    const description = this.itemFormGroup.get('description')?.value;
    const rarity = this.itemFormGroup.get('rarity')?.value;
    const image = this.itemFormGroup.get('image')?.value;
    const price = this.itemFormGroup.get('price')?.value;
    const newItem = new CollectionItem();
    newItem.id = maxId + 1;
    newItem.name = name ? name : '';
    newItem.description = description ? description : '';
    newItem.rarity = rarity ? this.matchRarity(rarity) : this.matchRarity("Common");
    newItem.image = image ? image : '';
    newItem.price = price ? price : 0;

    const newCollection = this.collectionService.addItem(this.selectedCollection, newItem);
    return newCollection ?? this.selectedCollection;
  }

  onUpdate(itemId: number | null): Collection | null {
    let verify: boolean = true;
    if(itemId == null) return null;
    this.selectedCollection.items = this.selectedCollection.items.map(
      (item) =>{
        if(item.id === itemId){
          const name = this.itemFormGroup.get('name')?.value;
          const description = this.itemFormGroup.get('description')?.value;
          const rarity = this.itemFormGroup.get('rarity')?.value;
          const image = this.itemFormGroup.get('image')?.value;
          const price = this.itemFormGroup.get('price')?.value;
          const newItem = new CollectionItem();
          newItem.id = item.id;
          newItem.name = name ? name : '';
          newItem.description = description ? description : '';
          newItem.rarity = rarity ? this.matchRarity(rarity) : this.matchRarity("Common");
          newItem.image = image ? image : '';
          newItem.price = price ? price : 0;
          verify = false;

          return newItem;
        }else{
          return item;
        }
      });

    if(verify) return null;

    return this.collectionService.update(this.selectedCollection)
  }

  onDelete(itemId: number | null): Collection | null{
    if(itemId == null) return null;
    console.log(`itemId: ${itemId}`)
    const existedItem = this.selectedCollection.items.find(item => item.id === itemId);
    if(!existedItem) return null;
    console.log(`existed item: ${JSON.stringify(existedItem, null, 2)}`);
    console.log(`selection id: ${this.selectedCollection.id}`)
    return this.collectionService.deleteItem(this.selectedCollection.id, itemId);
  }

  onCancel(){
    this.router.navigate(['home']);
  }

  private matchRarity(rarity: string): Rarity{
    const matchedRarity = this.rarities.find(thisRarity => thisRarity == rarity);
    return matchedRarity ?? "Common"
  }

}
