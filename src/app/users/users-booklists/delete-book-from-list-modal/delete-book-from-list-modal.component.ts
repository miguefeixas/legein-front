import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-delete-book-from-list-modal',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    TranslateModule,
  ],
  templateUrl: './delete-book-from-list-modal.component.html',
  styleUrl: './delete-book-from-list-modal.component.scss'
})
export class DeleteBookFromListModalComponent {

  constructor(private dialogRef: MatDialogRef<DeleteBookFromListModalComponent>) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  deleteBook(): void {
    this.dialogRef.close({ delete: true });
  }
}
