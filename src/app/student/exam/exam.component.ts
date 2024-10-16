import { Component } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [MatRadioModule, FormsModule, ReactiveFormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css'
})
export class ExamComponent {

  id: any

  subject: any

  user: any

  total: any = 0

  showResult: boolean = false

  examCheck: boolean = true

  studentInfo: any

  answersStatus: any[] = []

  iNum: any

  userSubjects: any[] = []

  private apiUrl = 'http://localhost:3000/';

  constructor(private route: ActivatedRoute, private service: AuthService, private toastr: ToastrService, private http: HttpClient) {
    this.id = this.route.snapshot.paramMap.get('id')
    this.getSubject()
    this.getLogedinUser()
  }

  getSubject() {
    this.service.getSubjectByID(this.id).subscribe(res => {
      this.subject = res
    })
  }

  updateSubject(model: any, id: any) {
    return this.http.put(this.apiUrl + 'subjects/' + id, model)
  }

  deleteItem(index: any) {
    this.subject.questions.splice(index, 1)

    const model = {
      name: this.subject.name,
      questions: this.subject.questions
    }

    this.updateSubject(model, this.id).subscribe(res => {
      this.toastr.success("تم حذف السؤال بنجاح")
    })
  }

  getRole() {
    return (this.http.get(this.apiUrl + 'login/1'))
  }

  getStudent(id: number) {
    return this.http.get(this.apiUrl + "students/" + id)
  }

  updateStudent(id: number, model: any) {
    return this.http.put(this.apiUrl + "students/" + id, model)
  }

  getLogedinUser() {
    this.getRole().subscribe((res) => {
      this.user = res;
      this.getUserData()
    }
    );
  }

  checkExam() {
    for (let i in this.userSubjects) {
      if (this.userSubjects[i].id == this.id) {
        this.total = this.userSubjects[i].degree
        this.examCheck = false
        this.toastr.warning("لقد أنجزت هذا الاختبار من قبل")
      }
    }
  }

  getUserData() {
    this.getStudent(this.user.userID).subscribe((res: any) => {
      this.studentInfo = res
      this.userSubjects = res?.subjects ? res?.subjects : []
      this.checkExam()
    })
  }

  getAns(event: any) {
    let value = event.value
    let questIndex = event.source.name
    this.subject.questions[questIndex].studentAns = value
    console.log(this.subject.questions)
  }

  getResult() {
    this.total = 0
    this.answersStatus = [];
    for (let i in this.subject.questions) {
      if (this.subject.questions[i].studentAns == this.subject.questions[i].correctAns) {

        this.total++;
        this.answersStatus.push({
          "id": i,
          "value": true
        });
      } else {
        this.answersStatus.push({
          "id": i,
          "value": false
        });
      }
    }
    this.showResult = true

    this.userSubjects.push({
      name: this.subject.name,
      id: this.id,
      degree: this.total
    }

    )

    const model = {
      username: this.studentInfo.username,
      email: this.studentInfo.email,
      password: this.studentInfo.password,
      subjects: this.userSubjects
    }
    this.updateStudent(this.user.userID, model).subscribe(res => {
      this.toastr.success("تم تسجيل النتيجة بنجاح")
    })
    console.log(this.total)
  }



}
