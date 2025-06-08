import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { CompleteUser, SessionUserData } from '../../../models/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteAccountModalComponent } from './delete-account-modal/delete-account-modal.component';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-users-profile',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './users-profile.component.html',
  styleUrl: './users-profile.component.scss'
})
export class UsersProfileComponent implements OnInit {
  /**
   * User stored
   */
  userStored: SessionUserData | undefined;

  /**
   * User profile
   */
  user: CompleteUser | undefined;

  /**
   * The profile picture URL
   */
  profilePictureUrl: string | undefined;

  /**
   * Reviews
   */
  reviews: Review[] = [];

  constructor(private authService: AuthService, private userService: UserService, private destroyRef: DestroyRef, private dialog: MatDialog, private reviewService: ReviewService, private router: Router) {
  }
  ngOnInit(): void {
    this.userStored = this.authService.getUserStored();

    if (this.userStored) {
      this.userService.getFullProfile(this.userStored.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
        this.user = user;
        console.log(this.user);
        if (user.profilePicture) {
          this.profilePictureUrl = user.profilePicture;
        } else {
          this.profilePictureUrl = `/assets/images/ProfPic${(this.user.id % 5) + 1}.png`;
        }
      });

      this.reviewService.getUserReviews(this.userStored.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(reviews => {
        this.reviews = reviews;
      });
    }
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(EditProfileModalComponent, {
      width: '60rem',
      data: this.user,
      autoFocus: false,
    });
  }

  deleteAccount(): void {
    const dialogRef = this.dialog.open(DeleteAccountModalComponent, {
      width: '30rem',
      autoFocus: false,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete) {
        if (this.userStored && this.userStored.id) {
          this.userService.deactivateUser(this.userStored.id).subscribe(() => {
            this.authService
            .logout()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('user');
              this.router.navigate(['login']);
            });
          })
        }
      }
    });
  }
}
