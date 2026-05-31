import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  hidePassword = true; // For toggling mask visibility

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Enforcing rigid synchronous validation criteria via FormBuilder
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.errorMessage = '';
    
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // Redirect straight to dashboard home on authorization success
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Invalid username or password. Please try again.';
        console.error('Authentication error details:', err);
      }
    });
  }
}