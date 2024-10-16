import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatInputModule, MatButtonModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent {

  private apiUrl = 'http://localhost:3000/';

  dataSource: any

  dataTable: any

  displayedColumns: any

  constructor(private http: HttpClient) {
    this.displayedColumns = ['position', 'name', 'subjectName', 'degree'];
  }

  ngOnInit(): void {
    this.getStudents()
  }

  getUsers(type: string) {
    return this.http.get(this.apiUrl + type)
  }

  getStudents() {
    this.getUsers('students').subscribe((res: any) => {
      this.dataSource = res?.map((student: any) => {
        if (student?.subjects) {
          return student?.subjects?.map((sub: any) => {
            return {
              name: student.username,
              subjectName: sub.name,
              degree: sub.degree
            }
          })
        } else {
          return [
            {
              name: student.username,
              subjectName: "-",
              degree: "-"
            }
          ]
        }

      })
      this.dataTable = []
      this.dataSource.forEach((item: any) => {
        item.forEach((subItem: any) => {
          this.dataTable.push({
            name: subItem.name,
            subjectName: subItem.subjectName,
            degree: subItem.degree
          })
        })
      });
    })

  }
}
