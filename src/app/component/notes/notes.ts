// src/app/Notes.component.ts

import { Component, OnInit } from '@angular/core';
import { getService} from '../../Services/getService'; // Assuming this imports your Service class
import { FormsModule } from '@angular/forms'; // Required for [(ngModel)]
import { forkJoin } from 'rxjs'; // <<< REQUIRED IMPORT for parallel subscription management
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notes',
  standalone: true, // As specified in your original snippet
  templateUrl: './notes.html',
  styleUrl: './notes.css',
  imports: [FormsModule, CommonModule] // Import FormsModule for ngModel usage
})
export class Notes implements OnInit {
  javaQuestions: any[] = [];
  pythonQuestions: any[] = [];
  cppQuestions: any[] = [];
  dotnetQuestions: any[] = [];

  isLoading: boolean = true; // Start loading
  hasError: boolean = false;
  currentQuestionIndex: number = 0;
  showAnswer: boolean = false;
  
  // Property to track the selected technology, default to 'java'
  selectedTech: 'java' | 'python' | 'cpp' | 'dotnet' = 'java'; 

  constructor(private service: getService) {
    // Initialization logic (none needed here as data loading is in ngOnInit)
  }

  ngOnInit() {
    this.readAllQuestions();
  }
  
  /**
   * Combines all four API calls using forkJoin.
   * Updates isLoading and hasError only after ALL subscriptions resolve.
   */
  readAllQuestions() {
    this.isLoading = true;
    this.hasError = false;

    // We map each call to return its data, and forkJoin waits for all to complete.
    forkJoin({
      java: this.service.getJavaQuestions(),
      python: this.service.getPythonQuestions(),
      cpp: this.service.getCPPQuestions(),
      dotnet: this.service.getdotNetQuestions()
    }).subscribe({
      next: (results: any) => {
        // Update arrays with results from the successful response object
        this.javaQuestions = results.java || [];
        this.pythonQuestions = results.python || [];
        this.cppQuestions = results.cpp || [];
        this.dotnetQuestions = results.dotnet || [];

        this.isLoading = false;
        console.log('✅ All questions loaded successfully.');
      },
      error: (error) => {
        // This runs if ANY of the underlying requests fail
        console.error('❌ Error fetching one or more question lists:', error);
        this.hasError = true;
        this.isLoading = false; 
      }
    });
  }

  // New: Getter to return the array of questions for the selected technology
  get Questions(): any[] {
    switch (this.selectedTech) {
      case 'java':
        return this.javaQuestions;
      case 'python':
        return this.pythonQuestions;
      case 'cpp':
        return this.cppQuestions;
      case 'dotnet':
        return this.dotnetQuestions;
      default:
        return [];
    }
  }

  // New: Method to handle when the technology selection changes
  onTechChange(): void {
    // Reset navigation and answer visibility when switching technologies
    this.currentQuestionIndex = 0;
    this.showAnswer = false;
  }

  // --- Navigation and Display Methods (remain largely the same) ---
  
  nextQuestion(): void {
    if (this.Questions.length > 0) {
      this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.Questions.length;
      this.showAnswer = false;
    }
  }

  previousQuestion(): void {
    if (this.Questions.length > 0) {
      this.currentQuestionIndex = (this.currentQuestionIndex - 1 + this.Questions.length) % this.Questions.length;
      this.showAnswer = false;
    }
  }

  toggleAnswer(): void {
    this.showAnswer = !this.showAnswer;
  }

  get currentQuestion(): any | null {
    if (this.Questions.length > 0) {
      return this.Questions[this.currentQuestionIndex];
    }
    return null;
  }
}