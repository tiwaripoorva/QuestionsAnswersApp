import { Component } from '@angular/core';
import { PostService } from '../../Services/post-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-tech',
  standalone: true,
  templateUrl: './add-tech.html',
  styleUrl: './add-tech.css',
  imports: [CommonModule, FormsModule]
})
export class AddTech {
  techName: string = '';
  message: string | null = null;
  isSuccess: boolean = false;
  isLoading: boolean = false;
  
  showExistingTechPrompt: boolean = false;
  existingTechName: string = ''; 

  // Inject PostService and Router
  constructor(private postService: PostService, private router: Router) {}

  addTechnology() {
    this.isLoading = true;
    this.message = null;
    this.showExistingTechPrompt = false;

    if (!this.techName.trim()) {
      this.message = 'Please enter a technology name.';
      this.isLoading = false;
      return;
    }

    // Call the POST API specifically for technology creation
    this.postService.addTechnologyCollection(this.techName).subscribe({
      next: (response) => {
        // This block handles a successful creation (Server returns 201)
        this.message = `✅ Technology "${this.techName}" added successfully!`;
        this.isSuccess = true;
        this.isLoading = false;
        
        // Navigate to AddQuestion component, passing the new tech name
        this.router.navigate(['/addQuestion', { tech: this.techName }]);
      },
      error: (error) => {
        this.isLoading = false;
        
        // Check if the error indicates the tech already exists (Server returns 200 or 409/specific code for "exists")
        // Based on the server logic provided earlier, if it returns 200 with a collection property, it exists.
        if (error.status === 200 && error.error && error.error.collection) {
           this.existingTechName = this.techName;
           this.message = `ℹ️ Technology "${this.techName}" already exists. Do you want to add a question to it?`;
           this.showExistingTechPrompt = true;
           this.isSuccess = false; // This state is informational, not a success creation
           
        } else {
           // General error (e.g., 500 server error or 400 bad request)
           console.error('Error adding technology:', error);
           this.message = `❌ Error creating technology: ${error.error?.message || 'Server connection failed.'}`;
           this.isSuccess = false;
        }
      }
    });
  }
  
  // Handlers for the "Tech already exists" prompt
  onYesClick(): void {
    // Navigate to add-question component, passing the existing tech name
    this.router.navigate(['/add-question', { tech: this.existingTechName }]);
  }

  onNoClick(): void {
    // Clear state and prompt, allowing the user to try a different name
    this.message = null;
    this.showExistingTechPrompt = false;
    this.techName = '';
  }
}
