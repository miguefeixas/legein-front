import { Component } from '@angular/core';
import { AdminMenuComponent } from '../admin/admin-menu/admin-menu.component';
import { RouterOutlet } from '@angular/router';
import { UsersMenuComponent } from './users-menu/users-menu.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    AdminMenuComponent,
    RouterOutlet,
    UsersMenuComponent,
    FooterComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

}
