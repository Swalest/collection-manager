import { ChangeDetectionStrategy, Component, input, model, output, Output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBar {

  //search = input<string>("Initial");
  //searchChange = output<string>();
  search = model<string>("Initial");
  searchButtonClicked: OutputEmitterRef<void> = output<void>();

  searchClicked() {
    this.searchButtonClicked.emit();
  }
  
/**For two-way binding */
  /*
  updateSearch(searchText: string) {
    this.searchChange.emit(searchText);
  }
  
 updateSearch(searchText: string) {
    this.search.set(searchText);
  }
    */
}
