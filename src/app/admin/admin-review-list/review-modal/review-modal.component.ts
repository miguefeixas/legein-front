import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Review } from 'src/models/review';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-review-modal',
  standalone: true,
  imports: [
    TranslateModule,
    MatDialogContent,
    RouterLink,
    MatDialogClose,
    MatDialogActions,
    MatButton,
    NgClass,
  ],
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.scss',
})
export class ReviewModalComponent implements OnInit {
  review: Review | undefined;
  statusIcon: string | undefined;
  statusClass: string | undefined;
  statusTranslation = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Review,
    private dialogRef: MatDialogRef<ReviewModalComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.review = this.data;
    this.getStatusInfo();
  }

  redirectToBook(): void {
    if (this.review?.bookId) {
      this.router.navigate(['/admin/books', this.review?.bookId]);
    }
  }

  getStatusInfo(): void {
    if (this.review?.disabled) {
      this.statusIcon = 'trash-outline';
      this.statusClass = 'table-chip--deleted';
      this.statusTranslation = 'REVIEWMODAL.STATUS.DELETED';
    } else {
      this.statusIcon = 'checkmark-done-outline';
      this.statusClass = 'table-chip--active';
      this.statusTranslation = 'REVIEWMODAL.STATUS.ACTIVE';
    }
  }
}
