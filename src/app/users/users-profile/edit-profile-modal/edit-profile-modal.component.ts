import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { NgxEditorModule } from 'ngx-editor';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../../services/user.service';
import { FileSizePipe } from '../../../../utils/pipes/filesize.pipe';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { Review } from '../../../../models/review';
import { CompleteUser, User } from '../../../../models/user';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepickerToggleIcon,
} from '@angular/material/datepicker';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgxEditorModule,
    ReactiveFormsModule,
    TranslateModule,
    FileSizePipe,
    NgClass,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerToggleIcon,
    MatSuffix,
  ],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.scss'
})
export class EditProfileModalComponent implements OnInit {
  profileForm: FormGroup;
  @ViewChild('fileInput') fileInput: any;
  selectedFile: File | null = null;
  previewUrl: string | undefined;
  user: CompleteUser | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CompleteUser,
    private userService: UserService,
    private dialogRef: MatDialogRef<EditProfileModalComponent>,
    private destroyRef: DestroyRef,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.user = data;

    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      firstLastName: new FormControl('', Validators.required),
      secondLastName: new FormControl(''),
      dateOfBirth: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phoneNumber: new FormControl(''),
      profilePicture: new FormControl(''),
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.previewUrl = this.user.profilePicture ? this.user.profilePicture : `/assets/images/ProfPic${(this.user.id % 5) + 1}.png`;
      this.profileForm.patchValue(this.user);

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
    }
  }

  removeFile($event: MouseEvent): void {
    this.selectedFile = null;
    this.previewUrl = this.user ? `/assets/images/ProfPic${(this.user.id % 5) + 1}.png` : undefined;
    this.fileInput.nativeElement.value = '';
    $event.stopPropagation();
  }

  onSubmit(): void {
    if (this.user) {
      this.user.name = this.profileForm.value.name;
      this.user.firstLastName = this.profileForm.value.firstLastName;
      this.user.secondLastName = this.profileForm.value.secondLastName;
      this.user.phoneNumber = this.profileForm.value.phoneNumber;
      this.user.dateOfBirth = this.profileForm.value.dateOfBirth;
      this.user.profilePicture = this.profileForm.value.profilePicture;
      this.userService.updateUserProfile(this.user, this.user.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((newUser) => {
        this.dialogRef.close();
      });
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  dateFilter = (d: Date | null): boolean => {
  const date = d || new Date();

  const cutoffDate = new Date(new Date().setFullYear(new Date().getFullYear() - 14));

  return date <= cutoffDate;
};

  startDate(): Date {
    if (this.user && this.user.dateOfBirth) {
      return new Date(this.user.dateOfBirth);
    } else {
      return new Date(new Date().setFullYear(new Date().getFullYear() - 14));
    }
  }
}
