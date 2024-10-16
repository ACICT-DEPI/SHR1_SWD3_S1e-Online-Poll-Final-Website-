import { Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-exam',
  standalone: true,
  imports: [MatStepperModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatRadioModule, FormsModule, CommonModule],
  templateUrl: './new-exam.component.html',
  styleUrl: './new-exam.component.css'
})
export class NewExamComponent {

  name = new FormControl("")

  questForm!: FormGroup;

  questArr: any[] = []

  correctNum: any

  startAdd: boolean = false

  subjectName: string = ""

  stepperIndex = 0

  preview: boolean = false

  id: any

  private apiUrl = 'http://localhost:3000/';

  constructor(private formB: FormBuilder, private toastr: ToastrService, private service: AuthService, private http: HttpClient) { }
  ngOnInit() {
    this.creatForm()
  }

  creatForm() {
    this.questForm = this.formB.group({
      question: ['', Validators.required],
      answer1: ['', Validators.required],
      answer2: ['', Validators.required],
      answer3: ['', Validators.required],
      answer4: ['', Validators.required]
    })
  }

  start() {
    const nameValue = this.name?.value ?? '';
    if (nameValue === "") {
      this.toastr.error("يرجى إدخال اسم المادة");
    } else {
      this.startAdd = true
      this.subjectName = nameValue;
    }
    if (this.startAdd) {
      this.stepperIndex = 1
    }
  }

  createSubject(model: any) {
    return this.http.post(this.apiUrl + 'subjects', model)
  }

  updateSubject(model: any, id: any) {
    return this.http.put(this.apiUrl + 'subjects/' + id, model)
  }

  submit() {
    const model = {
      name: this.subjectName,
      questions: this.questArr
    }

    if (this.preview) {
      this.stepperIndex = 2
    } else {
      this.createSubject(model).subscribe((res: any) => {
        this.preview = true
        this.id = res.id
      })
    }
  }



  creatQuest() {
    if (this.correctNum) {
      const model = {
        question: this.questForm.value.question,
        answer1: this.questForm.value.answer1,
        answer2: this.questForm.value.answer2,
        answer3: this.questForm.value.answer3,
        answer4: this.questForm.value.answer4,
        correctAns: this.questForm.value[this.correctNum]
      }

      this.questArr.push(model)
      this.questForm.reset()
    } else {
      this.toastr.error("يرجى إختيار الإجابة الصحيحة")
    }
    console.log(this.questArr)
  }

  clearForm() {
    this.questForm.reset()
  }

  cancelForm() {
    this.questForm.reset()
    this.questArr = []
    this.subjectName = ""
    this.name.reset()
    this.stepperIndex = 0
    this.startAdd = false
  }

  getCorrect(event: any) {
    this.correctNum = event.value
  }

  deleteItem(index: any) {
    this.questArr.splice(index, 1)

    const model = {
      name: this.subjectName,
      questions: this.questArr
    }

    this.updateSubject(model, this.id).subscribe(res => {
      this.toastr.success("تم حذف السؤال بنجاح")
    })
  }
}
