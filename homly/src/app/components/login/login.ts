import { Component, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  form: FormGroup;
  public error: string = '';
  public submitted: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private location: Location


  ) {
    this.form = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4)])
    });
  }

  onLogin() {
    this.submitted = true;

    if (this.form.invalid) return;

    this.authService.login(this.form.value.email, this.form.value.password).subscribe({
      next: datos => {
          this.authService.saveUser(datos);
          if (datos.role === 'ADMIN') {
              this.router.navigate(['/admin']);
          } else {
              this.router.navigate(['/']);
          }
      },
      error: (error: any) => {
        this.error = 'Datos incorrectos, comprueba tu email y contraseña';
        this.cdr.detectChanges();
        console.error('Error: ', error);
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goBack() {
    this.location.back();
  }
}