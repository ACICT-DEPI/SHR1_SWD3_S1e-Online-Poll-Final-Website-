import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatRadioModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup

  usersArr: any[] = []

  type: string = "students"

  constructor(private formB: FormBuilder, private http: HttpClient, private router: Router, private toaster: ToastrService, private service: AuthService) { }

  ngOnInit(): void {
    this.checkUsers()
    this.createForm()
  }

  getRole(event: any) {
    this.type = event.value
    this.checkUsers()
  }

  createForm() {
    this.loginForm = this.formB.group({
      type: [this.type],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  private apiUrl = 'http://localhost:3000/';

  getUsers(type: string) {
    return this.http.get(this.apiUrl + type)
  }

  checkUsers() {
    this.getUsers(this.type).subscribe((res: any) => {
      this.usersArr = res
    })
  }

  login(model: any) {
    return this.http.put(this.apiUrl + 'login/1', model)
  }

  submit() {

    let index = this.usersArr.findIndex(item => item.email == this.loginForm.value.email && item.password == this.loginForm.value.password)
    if (index == -1) {
      this.toaster.error("  الايميل أو كلمة المرور غير صحيحة", "", {
        disableTimeOut: false,
        titleClass: "toastr_title",
        messageClass: "toastr_message",
        timeOut: 5000,
        closeButton: true
      })
    } else {
      const model = {
        username: this.usersArr[index].username,
        role: this.type,
        userID: this.usersArr[index].id
      }
      this.login(model).subscribe(res => {
        this.service.user.next(res)
        this.toaster.success("تم تسجيل الدخول بنجاح", "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true
        })
        this.router.navigate(['/subjects'])
      })
    }

  }

}
