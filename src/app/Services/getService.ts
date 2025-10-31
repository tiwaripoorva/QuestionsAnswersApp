import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class getService {
  baseUri: string = 'http://localhost:3000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}
  
  
  // Get all employees
  getJavaQuestions() {
    console.log("gget java");
    
    return this.http.get(`${this.baseUri}/questions/java`);

  }

  getPythonQuestions() {
    console.log("get python");
    
    return this.http.get(`${this.baseUri}/questions/python`);

  }
  
  getdotNetQuestions() {
    console.log("get dotnet");

    
    return this.http.get(`${this.baseUri}/questions/dotnet`);
  }

  getCPPQuestions() {
    console.log("get cpp");

    return this.http.get(`${this.baseUri}/questions/CPP`);
  }


  /**
   * Fetches the list of all available technology collection names from the backend.
   */
  getTechnologies(): Observable<string[]> {
    console.log("Fetching list of all technologies"+`${this.baseUri}/technology/list`);
    return this.http.get<string[]>(`${this.baseUri}/technology/list`);
  }
  
  /**
   * Fetches all questions for a specific technology collection dynamically.
   * This is primarily used in the frontend logic for checking question existence/duplicates.
   * @param techName The name of the technology (e.g., 'angular', 'kafka').
   */
  getTechnologiesFromCollection(techName: string): Observable<any[]> {
    console.log(`Fetching questions for: ${techName}`);
    const sanitizedTechName = techName.trim().toLowerCase().replace(/\s+/g, '');
    return this.http.get<any[]>(`${this.baseUri}/questions/${sanitizedTechName}`);
  }

}