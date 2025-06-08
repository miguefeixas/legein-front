import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { BookListService } from '../../../services/book-list.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BookList } from '../../../models/book-list';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountModalComponent } from '../users-profile/delete-account-modal/delete-account-modal.component';
import { CreateBookListModalComponent } from './create-book-list-modal/create-book-list-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-users-lists',
  standalone: true,
  imports: [
    TranslateModule,
    MatButton,
  ],
  templateUrl: './users-lists.component.html',
  styleUrl: './users-lists.component.scss'
})
export class UsersListsComponent implements OnInit {
  lists: BookList[] = [];
  constructor(private bookListService: BookListService, private router: Router, private dialog: MatDialog, private toastr: ToastrService, private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.bookListService.getUserLists().subscribe((data) => {
      this.lists = data;
    })
  }

  openBookList(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/users/lists', id]);
    }
  }

  openCreateListModal(): void {
    const dialogRef = this.dialog.open(CreateBookListModalComponent, {
      width: '30rem',
      autoFocus: false,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.list) {
        this.lists.push(result.list);
        this.toastr.success(undefined,
            this.translate.instant('USERLIST.CREATELISTSUCCESS'),
            {
              timeOut: 3000,
              positionClass: 'toast-bottom-center',
            });
      }
    });
  }
}
