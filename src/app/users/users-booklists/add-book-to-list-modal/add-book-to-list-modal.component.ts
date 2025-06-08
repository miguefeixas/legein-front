import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { UsersBooksComponent } from '../../users-books/users-books.component';
import { Book } from '../../../../models/book';
import { BookListService } from '../../../../services/book-list.service';

@Component({
  selector: 'app-add-book-to-list-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    UsersBooksComponent,
  ],
  templateUrl: './add-book-to-list-modal.component.html',
  styleUrl: './add-book-to-list-modal.component.scss'
})
export class AddBookToListModalComponent {
  bookListId: number;

  constructor(private dialogRef: MatDialogRef<AddBookToListModalComponent>, @Inject(MAT_DIALOG_DATA) public data: { bookListId: number }, private bookListService: BookListService) {
    // Initialize any required services or variables here
    this.bookListId = data.bookListId;
    console.log(this.bookListId);
  }

  addBook($event: Book): void {
    this.bookListService.addBook(this.bookListId, $event.id).subscribe(() => {
      this.dialogRef.close({ book: $event });
    })
  }
}
