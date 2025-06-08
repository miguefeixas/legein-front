import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-delete-account-modal',
  standalone: true,
  imports: [
    TranslateModule,
    MatDialogActions,
    MatDialogContent,
  ],
  templateUrl: './delete-account-modal.component.html',
  styleUrl: './delete-account-modal.component.scss'
})
export class DeleteAccountModalComponent {
  constructor(private dialogRef: MatDialogRef<DeleteAccountModalComponent>) {
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  deleteAccount(): void {
    this.dialogRef.close({ 'delete': true });
  }
}
