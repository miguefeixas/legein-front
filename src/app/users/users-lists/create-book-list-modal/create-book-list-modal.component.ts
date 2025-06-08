import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { BookListService } from '../../../../services/book-list.service';
import { BookList } from '../../../../models/book-list';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-create-book-list-modal',
  standalone: true,
  imports: [
    TranslateModule,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    MatError,
  ],
  templateUrl: './create-book-list-modal.component.html',
  styleUrl: './create-book-list-modal.component.scss'
})
export class CreateBookListModalComponent {
  createListForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<CreateBookListModalComponent>, private bookListService: BookListService) {
    this.createListForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  closeModal(): void {
    this.dialogRef.close()
  }


  createList(): void {
    if (this.createListForm.invalid) {
      this.createListForm.markAllAsTouched();

      return;
    }
    const newList = new BookList(this.createListForm.value.name);
    this.bookListService.createBookList(newList).subscribe((data) => {
      console.log(data)
      this.dialogRef.close({ list: data });
    });
  }
}
