// src/app/component/navbar/navbar.ts

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../Services/auth-service';
// 1. Import CommonModule for structural directives and pipes
import { CommonModule } from '@angular/common'; 
// 2. Import RouterLink and RouterLinkActive for routing directives
import { RouterLink, RouterLinkActive } from '@angular/router'; 


@Component({
  selector: 'app-navbar',
  // Ensure the imports array contains the necessary modules for the template
  standalone: true,
  imports: [
    CommonModule,     // Includes *ngIf, *ngFor, async pipe, etc.
    RouterLink,       // Enables the [routerLink] directive
    RouterLinkActive  // Enables the routerLinkActive directive (for styling active links)
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isLoggedIn$: Observable<boolean>; 

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  onLogout() {
    this.authService.logout();
  }
}