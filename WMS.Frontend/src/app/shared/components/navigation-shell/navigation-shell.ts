import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-shell',
  standalone: false,
  templateUrl: './navigation-shell.html',
  styleUrl: './navigation-shell.css',
})
export class NavigationShell {
  constructor(private authService: AuthService, private router: Router) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
