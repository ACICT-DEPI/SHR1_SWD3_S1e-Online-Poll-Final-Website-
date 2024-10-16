import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new Subject()

  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  getRole() {
    return this.http.get(this.apiUrl + 'login/1')
  }

  login(model: any) {
    return this.http.put(this.apiUrl + 'login/1', model)
  }

  getAllSubjects() {
    return this.http.get(this.apiUrl + 'subjects')
  }

  getSubjectByID(id: any) {
    return this.http.get(this.apiUrl + 'subjects/' + id)
  }

}
