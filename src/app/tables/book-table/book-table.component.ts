import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  ViewChild,
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Book, BookStatus } from '../../../models/book';
import { DatePipe, NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookService } from '../../../services/book.service';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-book-table',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    TranslateModule,
    MatHeaderCellDef,
    NgClass,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    DatePipe,
    MatPaginator,
    MatSort,
    MatSortModule,
    RouterLinkActive,
    RouterLink,
  ],
  templateUrl: './book-table.component.html',
  styleUrl: './book-table.component.scss',
})
export class BookTableComponent implements AfterViewInit {
  @Input() columnsToDisplay = ['id', 'title', 'isbn', 'status'];
  @Input() tableData: Book[] = [];
  @Input() dataSource: MatTableDataSource<Book> = new MatTableDataSource<Book>(
    []
  );
  @Input() showPaginator = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  bookStatus = BookStatus;

  constructor(
    private bookService: BookService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
      switch (sortHeaderId) {
        case 'publicationDate':
          return data.publicationYear;
        default:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          return data[sortHeaderId];
      }
    };
  }

  getStatusClass(status: BookStatus): string {
    const baseClass = 'table-chip';
    switch (status) {
      case BookStatus.ACTIVE:
        return baseClass + '--active';
      case BookStatus.PENDING:
        return baseClass + '--pending';
      case BookStatus.REJECTED:
        return baseClass + '--rejected';
      case BookStatus.DELETED:
        return baseClass + '--deleted';
      default:
        return '';
    }
  }

  getStatusIcon(status: BookStatus): string {
    switch (status) {
      case BookStatus.ACTIVE:
        return 'checkmark-done-outline';
      case BookStatus.PENDING:
        return 'pause-outline';
      case BookStatus.REJECTED:
        return 'close-outline';
      case BookStatus.DELETED:
        return 'trash-outline';
      default:
        return '';
    }
  }

  editStatus(book: Book, status: BookStatus): void {
    book.status = status;

    this.bookService.getBookById(book.id).subscribe(book => {
      book.status = status;
      let authorsIds: number[] = [];
      if (book.authors) {
        authorsIds = book.authors.map(author => author.id);
      }
      const updatedBook = {
        ...book,
        authorIds: authorsIds,
        mainGenreId: book.genres ? book.genres[0].id : undefined,
        secondaryGenreId:
          book.genres && book.genres.length > 1 ? book.genres[1].id : undefined,
      };
      this.bookService.updateBook(updatedBook).subscribe(book => {
        if (book.status) {
          this.toastr.success(
            undefined,
            this.translate.instant('ADMINBOOKDETAILS.UPDATEDSUCCESS'),
            {
              timeOut: 3000,
              positionClass: 'toast-bottom-center',
            }
          );
        }
      });
    });
  }
}
