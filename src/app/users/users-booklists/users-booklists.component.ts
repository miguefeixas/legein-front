import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookListService } from '../../../services/book-list.service';
import { BookList } from '../../../models/book-list';
import { TranslateModule } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddBookToListModalComponent } from './add-book-to-list-modal/add-book-to-list-modal.component';
import { Book } from '../../../models/book';
import { DeleteBookFromListModalComponent } from './delete-book-from-list-modal/delete-book-from-list-modal.component';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-users-booklists',
  standalone: true,
  imports: [
    TranslateModule,
    MatButton,
  ],
  templateUrl: './users-booklists.component.html',
  styleUrl: './users-booklists.component.scss'
})
export class UsersBooklistsComponent implements OnInit{
  bookList: BookList | undefined;

  constructor(private router: Router, private route: ActivatedRoute, private bookListService: BookListService, private dialog: MatDialog) {
    // Initialize any required services or variables here
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.bookListService.getList(params['id']).subscribe((data) => {
          this.bookList = data;
          console.log(this.bookList)
        });
      }
    });
  }

  goToBook(bookId: number): void {
    this.router.navigate(['/users/books', bookId]);
  }

  addBookModal(): void {
    const dialogRef = this.dialog.open(AddBookToListModalComponent, {
      width: '60rem',
      autoFocus: false,
      data: {
        bookListId: this.bookList?.id,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.book) {
        if (this.bookList && this.bookList.books) {
          this.bookList.books.push(result.book);
        }
      }
    });
  }

  deleteBookFromListModal(book: Book, $event: MouseEvent): void {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteBookFromListModalComponent, {
      width: '30rem',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete && this.bookList && this.bookList.id) {
        this.bookListService.removeBook(this.bookList.id, book.id).subscribe(() => {
          if (this.bookList && this.bookList.books) {
            this.bookList.books = this.bookList.books.filter(b => b.id !== book.id);
          }
        });
      }
    });
  }
}
