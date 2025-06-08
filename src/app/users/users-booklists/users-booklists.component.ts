import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-booklists',
  standalone: true,
  imports: [],
  templateUrl: './users-booklists.component.html',
  styleUrl: './users-booklists.component.scss'
})
export class UsersBooklistsComponent {
  constructor(private router: Router) {
  }

  goToBook(bookId: number): void {
    this.router.navigate(['/users/list', bookId]);
  }
}
