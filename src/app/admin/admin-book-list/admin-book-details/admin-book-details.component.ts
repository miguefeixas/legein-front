import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BookTableComponent } from '../../../tables/book-table/book-table.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BookService } from 'src/services/book.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Book, BookStatus } from 'src/models/book';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { GenreService } from 'src/services/genre.service';
import { AuthorService } from 'src/services/author.service';
import { PublisherService } from 'src/services/publisher.service';
import { Publisher } from 'src/models/publisher';
import { Author } from 'src/models/author';
import { Genre } from 'src/models/genre';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { toolbar } from 'src/definitions/wysiwyg-toolbar';
import { ToastrService } from 'ngx-toastr';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatChip, MatChipListbox } from '@angular/material/chips';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-admin-book-details',
  standalone: true,
  imports: [
    BookTableComponent,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatOption,
    MatSelect,
    MatSuffix,
    TranslateModule,
    MatTooltip,
    NgClass,
    MatError,
    MatLabel,
    ReactiveFormsModule,
    NgxEditorModule,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatChipListbox,
    MatChip,
  ],
  templateUrl: './admin-book-details.component.html',
  styleUrl: './admin-book-details.component.scss',
})
export class AdminBookDetailsComponent implements OnInit {
  book: Book | undefined;

  numberOfAuthors = 0;
  numberOfGenres = 0;
  listOfAuthors = '';
  statusIcon = '';
  statusClass = '';
  isEditing = false;
  bookForm: FormGroup;
  publishers: Publisher[] = [];
  authors: Author[] = [];
  genres: Genre[] = [];
  bookTitle = '';
  mainAuthor: Author | undefined;
  editor: Editor = new Editor();
  toolbar: Toolbar = toolbar;
  bookCover: string | undefined;
  changedCover = false;
  selectedFile: File | null = null;
  bookStatus = BookStatus;

  @ViewChild('fileInput') fileInput: any;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private translate: TranslateService,
    private publisherService: PublisherService,
    private authorService: AuthorService,
    private genreService: GenreService,
    private toastr: ToastrService
  ) {
    this.bookForm = new FormGroup({
      title: new FormControl('', Validators.required),
      isbn: new FormControl('', [
        Validators.required,
        Validators.maxLength(13),
        Validators.minLength(10),
      ]),
      pages: new FormControl(undefined, Validators.required),
      publisherId: new FormControl(undefined, Validators.required),
      language: new FormControl('', Validators.required),
      authorIds: new FormControl([], Validators.required),
      mainGenreId: new FormControl(undefined, Validators.required),
      secondaryGenreId: new FormControl(undefined),
      overview: new FormControl(undefined, [
        Validators.required,
        Validators.maxLength(1200),
      ]),
      publicationYear: new FormControl(undefined, Validators.required),
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        if (params['id']) {
          this.bookService.getBookById(params['id']).subscribe(book => {
            this.book = book;
            this.bookTitle = book.title;
            this.mainAuthor = book.authors?.[0];
            this.bookCover = book.cover;
            this.populateEditForm(book);
            if (book.status) {
              this.getStatusIconClass(book.status);
            }
            if (book.authors && book.authors?.length > 1) {
              this.numberOfAuthors = book.authors?.length || 0;
              book.authors.forEach((author, index) => {
                if (index !== 0) {
                  if (index === 1) {
                    this.listOfAuthors = author.fullName
                      ? author.fullName
                      : author.name;
                  } else if (
                    book.authors &&
                    index === book.authors.length - 1
                  ) {
                    this.listOfAuthors += author.fullName
                      ? ` ${this.translate.instant('COMMONTRANSLATIONS.AND')} ${author.fullName}`
                      : ` ${this.translate.instant('COMMONTRANSLATIONS.AND')} ${author.name}`;
                  } else {
                    this.listOfAuthors += author.fullName
                      ? `, ${author.fullName}`
                      : `, ${author.name}`;
                  }
                }
              });
            }
            this.numberOfGenres = book.genres?.length || 0;
          });
        }
      });

    this.publisherService
      .getAllPublishers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(publishers => {
        this.publishers = publishers;
      });

    this.authorService
      .getAuthors()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(authors => {
        this.authors = authors;
      });

    this.genreService
      .getGenres()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(genres => {
        this.genres = genres;
      });

    this.bookForm
      .get('title')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.onTitleChange(value);
      });

    this.bookForm
      .get('authorIds')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.onAuthorsChange(value);
      });
  }

  populateEditForm(book: Book): void {
    this.bookForm.patchValue(book);
    const authorsIds: string[] = [];

    book.authors?.forEach(author => {
      if (author.id) {
        authorsIds.push(author.id.toString());
      }
      this.bookForm.patchValue({ authorIds: authorsIds });
    });

    book.genres?.forEach((genre, index) => {
      if (index === 0) {
        this.bookForm.patchValue({ mainGenreId: genre.id.toString() });
      } else {
        this.bookForm.patchValue({ secondaryGenreId: genre.id.toString() });
      }
    });

    this.bookForm.patchValue({ publisherId: book.publisher?.id.toString() });
  }

  getStatusIconClass(status: BookStatus): void {
    switch (status) {
      case BookStatus.ACTIVE:
        this.statusIcon = 'checkmark-done-outline';
        this.statusClass = 'table-chip--active';
        break;
      case BookStatus.PENDING:
        this.statusIcon = 'pause-outline';
        this.statusClass = 'table-chip--pending';
        break;
      case BookStatus.REJECTED:
        this.statusIcon = 'close-outline';
        this.statusClass = 'table-chip--rejected';
        break;
      case BookStatus.DELETED:
        this.statusIcon = 'trash-outline';
        this.statusClass = 'table-chip--deleted';
        break;
      default:
        break;
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.bookCover = this.book?.cover;
  }

  updateBook(): void {
    if (this.book && this.bookForm.value) {
      if (this.changedCover && this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.bookService
          .uploadImage(this.book.id, formData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.updateBookData();
          });
      } else {
        this.updateBookData();
      }
    }
  }

  updateBookData(): void {
    if (this.book) {
      const updatedBook = {
        ...this.bookForm.value,
        id: this.book.id,
        status: this.book.status,
      };

      this.bookService
        .updateBook(updatedBook)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          response => {
            this.toastr.success(
              undefined,
              this.translate.instant('ADMINBOOKDETAILS.UPDATEDSUCCESS'),
              {
                timeOut: 3000,
                positionClass: 'toast-bottom-center',
              }
            );
            this.isEditing = false;
            this.book = response;
            this.bookForm.markAsPristine();
          },
          () => {
            this.toastr.error(
              undefined,
              this.translate.instant('ADMINBOOKDETAILS.UPDATEDERROR'),
              {
                timeOut: 3000,
                positionClass: 'toast-bottom-center',
              }
            );
          }
        );
    }
  }

  onTitleChange(value: string): void {
    this.bookTitle = value;
  }

  private onAuthorsChange(value: number[]): void {
    if (value && value.length > 0) {
      this.mainAuthor = this.authors.find(
        author => author.id === Number(value[0])
      );
      if (value.length > 1) {
        this.numberOfAuthors = value.length;
        value.forEach((id, index) => {
          const author = this.authors.find(author => author.id === Number(id));
          if (index !== 0 && author) {
            if (index === 1) {
              this.listOfAuthors = author.fullName
                ? author.fullName
                : author.name;
            } else if (index === value.length - 1) {
              this.listOfAuthors += author.fullName
                ? ` ${this.translate.instant('COMMONTRANSLATIONS.AND')} ${author.fullName}`
                : ` ${this.translate.instant('COMMONTRANSLATIONS.AND')} ${author.name}`;
            } else {
              this.listOfAuthors += author.fullName
                ? `, ${author.fullName}`
                : `, ${author.name}`;
            }
          }
        });
      } else {
        this.listOfAuthors = '';
        this.numberOfAuthors = 0;
      }
    }
  }

  checkFormPristine(): boolean {
    return this.bookForm.pristine;
  }

  onCoverClick(): void {
    if (this.isEditing) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.type;

      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        this.selectedFile = file;
        if (this.selectedFile.size > 10 * 1024 * 1024) {
          this.toastr.error(
            this.translate.instant(
              'ADDBOOKMODAL.FORM.ERRORS.FILETOOLARGEMESSAGE'
            ),
            this.translate.instant(
              'ADDBOOKMODAL.FORM.ERRORS.FILETOOLARGETITLE'
            ),
            {
              timeOut: 3000,
              positionClass: 'toast-bottom-center',
            }
          );

          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (this.book) {
            this.bookCover = reader.result as string;
            this.changedCover = true;
            this.bookForm.markAsDirty();
          }
        };
        reader.readAsDataURL(file);
      } else {
        this.toastr.error(
          this.translate.instant('ADDBOOKMODAL.FORM.ERRORS.INVALIDFILEMESSAGE'),
          this.translate.instant('ADDBOOKMODAL.FORM.ERRORS.INVALIDFILETITLE'),
          {
            timeOut: 3000,
            positionClass: 'toast-bottom-center',
          }
        );
      }
    }
  }

  editStatus(status: BookStatus): void {
    if (!this.book) {
      return;
    }

    const updatedBook = {
      ...this.bookForm.value,
      id: this.book.id,
      status: status,
    };

    this.book.status = status;

    this.bookService.updateBook(updatedBook).subscribe(book => {
      if (book.status) {
        this.getStatusIconClass(book.status);
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
  }
}
