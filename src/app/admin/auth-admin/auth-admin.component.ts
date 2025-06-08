import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-admin',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth-admin.component.html',
  styleUrl: './auth-admin.component.scss',
})
export class AuthAdminComponent {}
