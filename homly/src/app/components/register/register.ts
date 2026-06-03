import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  form: FormGroup;
  public error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private location: Location

  ) {
    this.form = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(4)]),
      firstName: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      secondName: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4)]),
      phone: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]{9}$')]),      city: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      role: this.fb.control('USER')
    });
  }

public submitted: boolean = false;

  onRegister() {
      this.submitted = true;

      if (this.form.invalid) return;

      this.authService.register(this.form.value).subscribe({
          next: datos => {
              this.authService.saveUser(datos);
              this.router.navigate(['/']);
          },
          error: (error: any) => {
            if (error.status === 500) {
                this.error = 'Este email ya está registrado';
            } else {
                this.error = 'Error al registrarse, inténtalo de nuevo';
            }
            console.error('Error: ', error);
          }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goBack() {
    this.location.back();
  }

}