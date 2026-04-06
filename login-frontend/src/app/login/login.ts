import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  errorMessage: string = '';
  isLoading: boolean = false;

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4)]],
    rememberMe: [false]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.cdr.detectChanges();

    const { username, password, rememberMe } = this.loginForm.value;

    this.http.post<any>('http://localhost:8000/api/login/', { username, password })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          const storage = rememberMe ? localStorage : sessionStorage;

          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');

          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('refresh_token');
          sessionStorage.removeItem('user');

          storage.setItem('access_token', response.access);
          storage.setItem('refresh_token', response.refresh);
          storage.setItem('user', JSON.stringify(response.user));

          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Usuario o contraseña incorrectos.';
          this.cdr.detectChanges();
        }
      });
  }

  forgotPassword() {
    alert('Funcionalidad en desarrollo');
  }
}