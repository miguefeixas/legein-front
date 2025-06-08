import { Component } from '@angular/core';
import { DataRowOutlet } from '@angular/cdk/table';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    DataRowOutlet,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
