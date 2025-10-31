import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import all components
import { Home } from './component/home/home';         // <<< Home is now the public landing
import { Login } from './component/login/login';
import { SignUp } from './component/sign-up/sign-up';
import { Dashboard } from './component/dashboard/dashboard'; // <<< Dashboard is the protected layout

// Protected Components
import { Notes } from './component/notes/notes';
import { AddTech } from './component/add-tech/add-tech';
import { AddQuestions } from './component/add-questions/add-questions';
import { Error } from './component/error/error';
// import { AuthGuard } from './services/auth.guard'; // (For later)


const routes: Routes = [
  // ==========================================================
  // 1. PUBLIC ROUTES (Simple Landing Page)
  // ==========================================================
  { path: '', component: Home }, // Root path loads the simple Home component
  { path: 'login', component: Login },
  { path: 'signup', component: SignUp },
  // { path:  '**',component: Error},

  // ==========================================================
  // 2. PROTECTED DOMAIN (Dashboard Layout)
  // ==========================================================
  {
    path: 'dashboard', // Everything authenticated is nested under /dashboard
    component: Dashboard, // Dashboard acts as the layout container (with Navbar)
    // canActivate: [AuthGuard], // (For later JWT protection)
    children: [
      // Default: If they go to /dashboard, show the Notes component (main view)
      { path: '', redirectTo: 'viewQuestions', pathMatch: 'full' },
      
      // Functional protected paths
      { path: 'viewQuestions', component: Notes },
      { path: 'addTechnology', component: AddTech },
      { path: 'addQuestion', component: AddQuestions },
      
      // Optional: Add question with parameter
      // { path: 'addQuestion/:tech', component: AddQuestions },
    ]
  },

  // ==========================================================
  // 3. WILDCARD ROUTE (404 Page)
  // ==========================================================
  { path: '**', redirectTo: '' } // Redirect any unknown path back to the Home page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }