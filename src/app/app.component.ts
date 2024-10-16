import { Component } from '@angular/core';
import { LoginComponent } from "./auth/login/login.component";
import { RouterModule } from '@angular/router';
import { RegisterComponent } from "./auth/register/register.component";
import { NewExamComponent } from "./doctor/new-exam/new-exam.component";
import { StudentsComponent } from "./doctor/students/students.component";
import { SubjectsComponent } from "./doctor/subjects/subjects.component";
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AuthService } from './auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, NavBarComponent, RouterModule, RegisterComponent, NewExamComponent, StudentsComponent, SubjectsComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'exam';

  constructor(private service: AuthService) { }

  ngOnInit(): void {
    this.getUserData()
  }

  getUserData() {
    this.service.getRole().subscribe(res => {
      this.service.user.next(res)
    })
  }


}
