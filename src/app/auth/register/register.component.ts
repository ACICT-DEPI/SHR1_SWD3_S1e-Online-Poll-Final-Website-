import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatRadioModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  userForm!: FormGroup

  studentsArr: any[] = []

  constructor(private formB: FormBuilder, private http: HttpClient, private router: Router, private toaster: ToastrService, private service: AuthService) { }

  ngOnInit(): void {
    this.createForm()
    this.getEmail()
  }

  createForm() {
    this.userForm = this.formB.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confPassword: ['', [Validators.required]],
    })
  }

  private apiUrl = 'http://localhost:3000/';

  addUser(model: any): Observable<any> {
    return this.http.post(this.apiUrl + 'students', model)
  }

  login(model: any) {
    return this.http.put(this.apiUrl + 'login/1', model)
  }


  getUsers() {
    return this.http.get(this.apiUrl + 'students')
  }

  getEmail() {
    this.getUsers().subscribe((res: any) => {
      this.studentsArr = res
    })
  }

  submit() {
    const model = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
    }

    let index = this.studentsArr.findIndex(item => item.email == this.userForm.value.email)
    if (index !== -1) {
      this.toaster.error("الايميل مستخدم بالفعل", "", {
        disableTimeOut: false,
        titleClass: "toastr_title",
        messageClass: "toastr_message",
        timeOut: 5000,
        closeButton: true
      })
    } else {
      this.addUser(model).subscribe((res: any) => {
        this.toaster.success("تم إنشاء الحساب بنجاح", "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true

        })
        const model = {
          username: res.username,
          role: "students",
          userID: res.id
        }
        this.login(model).subscribe((res: any) => {
          this.service.user.next(res)
        })
        console.log(model.username)
        this.router.navigate(['/subjects'])
      })
    }

  }

}
