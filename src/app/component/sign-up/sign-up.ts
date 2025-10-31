import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../../Services/post-service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.html',
  // Reference the shared CSS file
  styleUrl: './sign-up.css',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class SignUp {
  // Model properties for two-way binding
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private postService: PostService
  ) {}

  handleSignUp() {
    this.errorMessage = '';
    
    // Basic client-side validation
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Call the sign-up service
    this.postService.signUp({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        if (response.success) {
          // Redirect to login page on successful signup
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'An error occurred during sign up.';
      }
    });
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // --- TEMPORARY SIMULATION ---
    console.log('Simulating registration for:', this.email);
    
    // In the JWT stage, this is where you'd call your API
    // Upon successful registration, redirect to the Login page.
    alert('Registration successful! Please log in.');
    this.router.navigate(['/login']);
  }
}