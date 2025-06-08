import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompleteUser, User } from '../../../../models/user';
import { NgxEditorModule } from 'ngx-editor';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe, NgClass } from '@angular/common';
import { ReviewService } from '../../../../services/review.service';
import { Review } from '../../../../models/review';
import { MatButton } from '@angular/material/button';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-user-details',
  standalone: true,
  imports: [
    NgxEditorModule,
    ReactiveFormsModule,
    TranslateModule,
    DatePipe,
    MatButton,
    NgClass,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  userDetail: CompleteUser | undefined;
  reviews: Review[] = [];
  constructor(private userService: UserService, private route: ActivatedRoute, private reviewService: ReviewService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.userService.getFullProfile(params['id']).subscribe((data) =>{
          this.userDetail = data;
          this.reviewService.getUserReviews(this.userDetail.id).subscribe((data) => {
            this.reviews = data;
          });
        });
      }
    });
  }

  openReviews(): void {
    if (this.userDetail?.username) {
      const username = this.userDetail.username;
      this.router.navigate(['/admin/reviews'], { fragment: username })
    }
  }

  deleteUser(): void {
    if (this.userDetail?.id) {
      this.userService.deleteUser(this.userDetail.id).subscribe(() => {
        this.router.navigate(['/admin/users']);
      });
    }
  }

  activateUser(): void {
    if (this.userDetail?.id) {
      this.userService.activateUser(this.userDetail.id).subscribe(() => {
        if (this.userDetail) {
          this.userDetail.disabled = false;
        }
      });
    }
  }

  deactivateUser(): void {
    if (this.userDetail?.id) {
      this.userService.deactivateUser(this.userDetail.id).subscribe(() => {
        if (this.userDetail) {
          this.userDetail.disabled = true;
        }
      });
    }
  }

  getStatusClass(user: CompleteUser | undefined): string {
    if (!user) {
      return '';
    }
    let baseClass = 'table-chip';
    if (user.disabled) {
      if (user.createdAt?.toISOString() === user.modifiedAt?.toISOString()) {
        baseClass = baseClass + '--pending';
      } else {
        baseClass = baseClass + '--deleted';
      }
    } else {
      baseClass = baseClass + '--active';
    }

    return baseClass;
  }

  getStatusIcon(user: CompleteUser | undefined): string {
    if (!user) {
      return '';
    }
    if (user.disabled) {
      if (user.createdAt?.toISOString() === user.modifiedAt?.toISOString()) {
        return 'pause-outline';
      } else {
        return 'trash-outline';
      }
    } else {
      return 'checkmark-done-outline';
    }
  }

  getStatusTranslationKey(user: CompleteUser | undefined): string {
    if (!user) {
      return '';
    }
    if (user.disabled) {
      if (user.createdAt?.toISOString() === user.modifiedAt?.toISOString()) {
        return 'USERS.TABLE.STATUS.PENDING';
      } else {
        return 'USERS.TABLE.STATUS.DELETED';
      }
    } else {
      return 'USERS.TABLE.STATUS.ACTIVE';
    }
  }
}
