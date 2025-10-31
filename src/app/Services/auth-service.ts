// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- Import HttpClient
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    // BehaviorSubject holds the current state and emits new states to subscribers
    private loggedIn = new BehaviorSubject<boolean>(false);
    isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

    // Define your backend base URL
    private apiUrl = 'http://localhost:3000/api'; // Adjust port and route as needed

    // Inject HttpClient
    constructor(private router: Router, private http: HttpClient) {
        // In a real app, check for a stored token here
    }

    /**
     * @function signUp
     * Sends the user registration data to the Node/Express backend.
     */
    signUp(userData: any): Observable<any> {
        console.log("Sending sign-up request to backend...");
        const url = `${this.apiUrl}/SignUp`; // The POST endpoint you created in Express

        return this.http.post(url, userData).pipe(
            // Use tap for side effects (like logging), but don't modify the data
            tap(response => {
                console.log('Sign-up success response:', response);
                // After successful sign-up, you might automatically log them in
                // or just navigate them to the login page.
                this.router.navigate(['/login']); 
            }),
            // Handle any network or server errors
            catchError(error => {
                console.error('Sign-up failed on the client side:', error);
                // Re-throw the error so the component can handle it (e.g., show an error message)
                return throwError(() => new Error(error.message || 'Sign-up failed'));
            })
        );
    }

    // --- TEMPORARY LOGIN/LOGOUT METHODS (Will be updated later with API calls) ---

    // Temporary login method for testing the UI switch
    login() {
        console.log("Simulated Login: Setting state to true.");
        // In the future, this will call a POST /api/login endpoint and store the JWT.
        this.loggedIn.next(true);
        this.router.navigate(['/dashboard']);
    }
    
    // Temporary logout method
    logout() {
        console.log("Simulated Logout: Setting state to false.");
        // In the future, this will clear the stored JWT.
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }
}