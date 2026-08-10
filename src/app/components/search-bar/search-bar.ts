import { ChangeDetectionStrategy, Component, model, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBar {

  search = model<string>("Initial");
  searchButtonClicked: OutputEmitterRef<void> = output<void>();

}
