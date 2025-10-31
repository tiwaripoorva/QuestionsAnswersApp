import { Component } from '@angular/core';
import { getService } from '../../Services/getService';
import { PostService } from '../../Services/post-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-questions',
  standalone: true,
  templateUrl: './add-questions.html',
  styleUrl: './add-questions.css',
  imports: [CommonModule, FormsModule]
})
export class AddQuestions {

  availableTechnologies: string[] = [];
  selectedTech: string = '';
  
  questionData = {
    question: '',
    answer: ''
  };

  message: string | null = null;
  isSuccess: boolean = false;
  isLoading: boolean = false;
  
  // State for duplicate check
  isDuplicate: boolean = false; 

  // Inject both services
  constructor(private readService: getService, private postService: PostService) {}

  ngOnInit() {
    this.loadTechnologies();
  }

  loadTechnologies(): void {
    this.isLoading = true;
    this.readService.getTechnologies().subscribe({
      next: (techs: string[]) => {
        this.availableTechnologies = techs;
        this.isLoading = false;
        
        // Attempt to set the first one as default if available
        if (techs.length > 0) {
          this.selectedTech = techs[0];
        }
      },
      error: (err) => {
        console.error('Error loading technologies:', err);
        this.message = 'Error loading available technologies. Check server connection.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    });
  }

  async onSubmit() {
    this.isLoading = true;
    this.message = null;
    this.isDuplicate = false;
    
    if (!this.selectedTech || !this.questionData.question || !this.questionData.answer) {
      this.message = 'Please select a technology and fill in the question and answer.';
      this.isLoading = false;
      return;
    }

    // 1. Check for Duplicate Question BEFORE submitting the final post
    const isExisting = await this.checkDuplicateQuestion(this.selectedTech, this.questionData.question);
    
    if (isExisting) {
        this.message = `Question already exists in ${this.selectedTech}. Please modify the question text.`;
        this.isSuccess = false;
        this.isLoading = false;
        this.isDuplicate = true;
        return;
    }

    // 2. If not duplicate, proceed to add the question
    this.postService.addQuestion(this.selectedTech, this.questionData).subscribe({
      next: (response) => {
        this.message = `✅ Question successfully added to ${this.selectedTech}!`;
        this.isSuccess = true;
        this.isLoading = false;
        this.questionData = { question: '', answer: '' }; // Clear form fields
      },
      error: (error) => {
        console.error('Error adding question:', error);
        this.message = `❌ Error adding question: ${error.error?.message || 'Server error.'}`;
        this.isSuccess = false;
        this.isLoading = false;
      }
    });
  }
  
  // Helper function to check duplicates by querying the backend
  private async checkDuplicateQuestion(tech: string, questionText: string): Promise<boolean> {
      // We leverage the GET API that fetches questions for a technology
      return new Promise((resolve) => {
          this.readService.getTechnologiesFromCollection(tech).subscribe({
              next: (questions: any[]) => {
                  const normalizedQuestion = questionText.trim().toLowerCase();
                  
                  // Check if any existing question exactly matches the normalized input
                  const exists = questions.some(q => q.question && q.question.trim().toLowerCase() === normalizedQuestion);
                  resolve(exists);
              },
              error: () => {
                  // If GET fails, assume no conflict for safety, or handle as an error based on preference.
                  // Here, we assume failure to check means no conflict found to proceed with POST.
                  resolve(false); 
              }
          });
      });
  

    }
  }
