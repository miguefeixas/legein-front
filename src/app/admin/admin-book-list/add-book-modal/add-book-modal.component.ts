import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BookService } from 'src/services/book.service';
import { PublisherService } from 'src/services/publisher.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FileSizePipe } from 'src/utils/pipes/filesize.pipe';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Publisher } from '../../../../models/publisher';
import { AuthorService } from '../../../../services/author.service';
import { Author } from '../../../../models/author';
import { GenreService } from '../../../../services/genre.service';
import { Genre } from '../../../../models/genre';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { toolbar } from '../../../../definitions/wysiwyg-toolbar';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { isbnValidator } from '../../../../definitions/custom-validators';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-add-book-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    TranslateModule,
    MatButton,
    MatDialogActions,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    FileSizePipe,
    MatOption,
    MatSelect,
    NgClass,
    NgxEditorModule,
  ],
  templateUrl: './add-book-modal.component.html',
  styleUrl: './add-book-modal.component.scss',
})
export class AddBookModalComponent implements OnInit {
  bookForm: FormGroup;
  @ViewChild('fileInput') fileInput: any;
  selectedFile: File | null = null;
  publishers: Publisher[] = [];
  authors: Author[] = [];
  genres: Genre[] = [];
  currentPage = 0;
  newBookId: number | undefined;
  previewUrl: string | null = null;
  editor: Editor = new Editor();

  constructor(
    private dialogRef: MatDialogRef<AddBookModalComponent>,
    private publisherService: PublisherService,
    private destroyRef: DestroyRef,
    private authorService: AuthorService,
    private genreService: GenreService,
    private bookService: BookService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.bookForm = new FormGroup({
      title: new FormControl('', Validators.required),
      isbn: new FormControl('', [Validators.required, isbnValidator]),
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
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const newBook = {
        ...this.bookForm.value,
      };

      this.bookService
        .insertBook(newBook)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(book => {
          this.newBookId = book.id;
          this.toastr.success(
            undefined,
            this.translate.instant('ADDBOOKMODAL.CREATEBOOKSUCCESS'),
            {
              timeOut: 3000,
              positionClass: 'toast-bottom-center',
            }
          );
        });

      this.currentPage++;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.type;

      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        this.selectedFile = file;

        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result as string;
        };
        reader.readAsDataURL(this.selectedFile);
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

  onDragDropClick(): void {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLElement;
    fileInput.click();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const fileType = file.type;

      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        this.selectedFile = file;

        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result as string;
        };
        reader.readAsDataURL(this.selectedFile);
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

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  uploadImage(): void {
    if (this.selectedFile) {
      if (this.selectedFile.size > 10 * 1024 * 1024) {
        this.toastr.error(
          this.translate.instant(
            'ADDBOOKMODAL.FORM.ERRORS.FILETOOLARGEMESSAGE'
          ),
          this.translate.instant('ADDBOOKMODAL.FORM.ERRORS.FILETOOLARGETITLE'),
          {
            timeOut: 3000,
            positionClass: 'toast-bottom-center',
          }
        );

        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.bookService
        .uploadImage(this.newBookId, formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  removeFile($event: MouseEvent): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.fileInput.nativeElement.value = '';
    $event.stopPropagation();
  }

  protected readonly toolbar = toolbar;
}
