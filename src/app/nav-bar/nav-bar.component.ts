import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatGridListModule,
    MatExpansionModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    RouterModule,
    HttpClientModule,
    CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {

  constructor(private service: AuthService, private http: HttpClient) { }

  user: any = null

  private apiUrl = 'http://localhost:3000/';

  ngOnInit(): void {
    this.service.user.subscribe((res: any) => {
      if (res.role) {
        this.user = res
      }
    })
  }

  login(model: any) {
    return this.http.put(this.apiUrl + 'login/1', model)
  }

  logOut() {
    const model: never[] = []
    this.login(model).subscribe(res => {
      this.user = null
      this.service.user.next(res)
    })
  }
}
