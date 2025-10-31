import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// We need PostService for the API call. Check path if necessary.
import { PostService } from '../../Services/post-service'; 
// import { AuthService } from '../../Services/auth-service'; // <-- Keeping this commented out for now.

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  
  templateUrl: './login.html',
  // You might need to change the path if you renamed the file to 'auth-forms.css'
  styleUrls: ['./login.css'] 
})
export class Login implements OnInit {
  // --- UPDATED: Using 'email' to match backend login API (instead of username) ---
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    // We inject PostService to make the API call to your Node.js server
    private postService: PostService, 
    // private authService: AuthService, // If you need this for state, re-add it.
    private router: Router
  ) {}

  ngOnInit(): void {
    // Logic for redirecting logged-in users (Requires a proper AuthService)
    /* this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/dashboard']); 
      }
    });
    */
  }

  handleLogin() {
    this.errorMessage = '';
    
    // 1. Validation (using email)
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    // 2. Call the Login API
    this.postService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Login successful. User:', response.username);
          // TODO: Store token/user data here in local storage or a state management service
          
          // Navigate on successful login
          this.router.navigate(['/dashboard']); 
        } else {
          // This handles responses where success is false, but the HTTP status is 200 (less common).
          this.errorMessage = response.message || 'Login failed.';
        }
      },
      error: (errorResponse) => {
        // This handles HTTP status codes like 401 (Unauthorized) or 500 (Server Error)
        const error = errorResponse.error;
        // Use the specific message sent from the Node.js server
        this.errorMessage = error?.message || 'Login failed. Check server connection.';
        console.error('Login API error:', errorResponse);
      }
    });
  }
}
