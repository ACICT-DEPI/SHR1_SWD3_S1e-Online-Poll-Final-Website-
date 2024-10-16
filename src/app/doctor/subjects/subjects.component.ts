import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatButtonModule, MatInputModule, MatRadioModule, RouterModule],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css'
})
export class SubjectsComponent {

  constructor(private service: AuthService, private http: HttpClient, private toastr: ToastrService) { }

  subjectArr: any[] = []

  user: any

  private apiUrl = 'http://localhost:3000/';

  ngOnInit(): void {
    this.getSubjects()
    this.getUserInfo()
  }

  getSubjects() {
    this.service.getAllSubjects().subscribe((res: any) => {
      this.subjectArr = res
    })
  }
  deleteSubject(id: number) {
    return this.http.delete(this.apiUrl + 'subjects/' + id)
  }

  getRole() {
    return (this.http.get(this.apiUrl + 'login/1'))
  }

  getUserInfo() {
    this.getRole().subscribe(
      (res) => {
        this.user = res;
      }
    );
  }

  deleteExam(index: any) {
    let id = this.subjectArr[index].id
    this.subjectArr.splice(index, 1)
    this.deleteSubject(id).subscribe(res => {
      this.toastr.success("تم حذف المادة بنجاح")
    })
  }
}
