import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// --- Interfaces for Request/Response Data ---
interface SignUpData {
    username: string;
    email: string;
    password: string;
}

interface SignUpResponse {
    success: boolean;
    message: string;
    userId?: string;
}

// NEW INTERFACE for Login Request
interface LoginData {
    email: string; // Using email for login
    password: string;
}

// NEW INTERFACE for Login Response
interface LoginResponse {
    success: boolean;
    message: string;
    userId?: string;
    username?: string;
    token?: string; // Placeholder for future JWT token
}

// Interface for the data sent when adding a question
interface QuestionData {
    question: string;
    answer: string;
}

// Interface for the response when creating a new technology
interface TechResponse {
    message: string;
    collection: string; // The sanitized collection name
}

// Interface for the response when adding a question
interface QuestionAddResponse {
    message: string;
    insertedId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // Use the same base URI as your existing Service
  private baseUri: string = 'http://localhost:3000/api';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}
  
  /**
   * API to create a new user account.
   * This sends data to the '/signup' endpoint. 
   * Your backend should handle storing this data in a 'users' or 'SignUp' collection.
   */
  signUp(userData: SignUpData): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${this.baseUri}/signup`, userData);
  }

  /**
   * NEW METHOD: API to log in a user.
   * POST /api/login
   * @param credentials The user's email and password.
   */
  login(credentials: LoginData): Observable<LoginResponse> {
    // Sends credentials to the new server endpoint
    return this.http.post<LoginResponse>(
      `${this.baseUri}/login`, 
      credentials,
      { headers: this.headers }
    );
  }
  
  /**
   * API to create a new technology collection.
   * POST /api/technology/create/{{techName}}
   * @param techName The name of the technology (e.g., 'Angular').
   */
  addTechnologyCollection(techName: string): Observable<TechResponse> {
    // Note: We use .post() with an empty body {} as the data is in the URL parameter.
    return this.http.post<TechResponse>(
      `${this.baseUri}/technology/create/${techName}`, 
      {},
      { headers: this.headers }
    );
  }
  
  /**
   * API to add a question to a specific collection.
   * POST /api/questions/{{techName}}
   * @param techName The name of the target technology (e.g., 'java').
   * @param data The question and answer object.
   */
  addQuestion(techName: string, data: QuestionData): Observable<QuestionAddResponse> {
    return this.http.post<QuestionAddResponse>(
      `${this.baseUri}/questions/${techName}`, 
      data,
      { headers: this.headers }
    );
  }
}
