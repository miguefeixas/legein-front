import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { UsersTableComponent } from '../../tables/users-table/users-table.component';
import { BookTableComponent } from '../../tables/book-table/book-table.component';
import { BookService } from '../../../services/book.service';
import { Book, BookStatus } from '../../../models/book';
import { MatTableDataSource } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddBookModalComponent } from './add-book-modal/add-book-modal.component';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-admin-book-list',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatOption,
    MatSelect,
    MatSuffix,
    TranslateModule,
    UsersTableComponent,
    BookTableComponent,
    MatButton,
  ],
  templateUrl: './admin-book-list.component.html',
  styleUrl: './admin-book-list.component.scss',
})
export class AdminBookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  dataSource = new MatTableDataSource<Book>([]);
  selectedStatus = '';
  searchTitle = '';
  selectedPageRange: { min: number; max: number } | undefined;
  bookStatus: string[] = Object.values(BookStatus);
  pageRanges = [
    { label: '< 100', min: 0, max: 100 },
    { label: '101 - 200', min: 101, max: 200 },
    { label: '201 - 300', min: 201, max: 300 },
    { label: '301 - 400', min: 301, max: 400 },
    { label: '> 400', min: 401, max: Infinity },
  ];
  columnsToDisplay = [
    'id',
    'title',
    'isbn',
    'pages',
    'publisher',
    'publicationDate',
    'status',
    'details',
  ];
  constructor(
    private bookService: BookService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe(books => {
      this.books = books;
      this.filteredBooks = books;
      this.dataSource.data = this.filteredBooks;
    });
  }

  applyFilter(): void {
    this.filteredBooks = this.books.filter(book => {
      const matchesStatus = this.selectedStatus
        ? book.status === this.selectedStatus
        : true;

      let matchesTitleOrIsbn = true;
      if (this.searchTitle && (book.title || book.isbn)) {
        matchesTitleOrIsbn = this.searchTitle
          ? book.title
              ?.toLowerCase()
              .includes(this.searchTitle.toLowerCase()) ||
            book.isbn?.toLowerCase().includes(this.searchTitle.toLowerCase())
          : true;
      } else if (this.searchTitle) {
        matchesTitleOrIsbn = false;
      }

      let matchesPageRange = true;
      if (book.pages) {
        matchesPageRange = this.selectedPageRange
          ? book.pages >= this.selectedPageRange.min &&
            book.pages <= this.selectedPageRange.max
          : true;
      }

      return matchesStatus && matchesTitleOrIsbn && matchesPageRange;
    });
    this.dataSource.data = this.filteredBooks;
  }

  removeContent($event: MouseEvent): void {
    if (this.searchTitle !== '') {
      this.searchTitle = '';
      this.applyFilter();
      $event.stopPropagation();
    }
  }

  openAddBookModal(): void {
    const addBookModalOptions = {
      minWidth: '40.25rem',
      width: 'fit-content',
      height: '80vh',
      autoFocus: false,
    };

    const addBookModal = this.dialog.open(
      AddBookModalComponent,
      addBookModalOptions
    );

    addBookModal.afterClosed().subscribe((newBook: Book) => {
      if (newBook) {
        this.books.push(newBook);
        this.applyFilter();
      }
    });
  }
}
