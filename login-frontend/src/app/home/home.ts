import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  user: any = null;
  error: string = '';

  ngOnInit() {
    this.http.get<any>('http://localhost:8000/api/profile/').subscribe({
      next: (response) => {
        console.log('Profile OK', response);
        this.user = response;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Profile error', err);
        this.error = 'Error al obtener el perfil.';
        this.user = null;
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');

    this.router.navigate(['/']);
  }
}