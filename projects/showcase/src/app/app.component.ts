import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgsJsonUtilsService } from '../../../ngs-json-utils/src/lib/ngs-json-utils.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  ngsJsonUtilsService = inject(NgsJsonUtilsService);
}
