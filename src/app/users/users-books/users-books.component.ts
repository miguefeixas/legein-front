import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Módulos de Angular Material para los formularios y la paginación
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Book } from '../../../models/book';
import { BookService } from '../../../services/book.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-users-books',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButton,
  ],
  templateUrl: './users-books.component.html',
  styleUrls: ['./users-books.component.scss']
})
export class UsersBooksComponent {
  @Input() modal = false;
  @Output() selectedBook = new EventEmitter<Book>

  // Listas de libros: completa (después de aplicar filtros) y de la página actual.
  allBooks: Book[] = [];
  books: Book[] = [];
  pagedBooks: Book[] = [];

  // Variables para los filtros
  filterTitle = '';
  filterYear = '';

  // Array de años disponibles para el select
  years: number[] = [];

  // Variables para la paginación
  pageIndex = 0;
  pageSize = 10;

  constructor(private bookService: BookService, private router: Router) {
    this.bookService.getAllBooks().subscribe((books) => {
      // Al obtener los libros, se guardan la lista completa y la lista filtrada inicial
      this.allBooks = books;
      this.books = books;
      // Se extraen los años para el filtro
      this.extractYears();
      // Se inicializa la paginación
      this.updatePagedBooks();
    });
  }

  /**
   * Extrae los años de publicación de los libros y los ordena.
   */
  extractYears(): void {
    const yearSet = new Set<number>();
    this.allBooks.forEach((book) => {
      if (book.publicationYear) {
        yearSet.add(book.publicationYear);
      }
    });
    this.years = Array.from(yearSet).sort((a, b) => a - b);
  }

  /**
   * Aplica los filtros de título y año a la lista completa de libros.
   * También resetea la paginación a la primera página.
   */
  applyFilters(): void {
    this.books = this.allBooks.filter((book) => {
      const matchesTitle = this.filterTitle
        ? book.title.toLowerCase().includes(this.filterTitle.toLowerCase())
        : true;
      const matchesYear = this.filterYear
        ? book.publicationYear === +this.filterYear
        : true;

      return matchesTitle && matchesYear;
    });
    // Al cambiar filtros, se reinicia la página actual
    this.pageIndex = 0;
    this.updatePagedBooks();
  }

  /**
   * Actualiza la lista de libros que se muestran en función de la página actual.
   */
  updatePagedBooks(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedBooks = this.books.slice(startIndex, endIndex);
  }

  /**
   * Maneja el evento de cambio de página del mat-paginator.
   * @param event Objeto PageEvent con la información de la nueva página y tamaño.
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedBooks();
  }

  /**
   * Navega al detalle del libro seleccionado.
   * @param bookId ID del libro
   */
  goToBook(bookId: number): void {
    this.router.navigate(['/users/books', bookId]);
  }

  addBookToListModal(book: Book, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedBook.emit(book);
  }
}
