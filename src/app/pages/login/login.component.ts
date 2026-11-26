import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  isRegister = signal(false);

  constructor(
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleMode(): void {
    this.isRegister.update(v => !v);
    this.authService.error.set(null);
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (this.isRegister()) {
      this.authService.register(this.form.value);
    } else {
      this.authService.login(this.form.value);
    }
  }
}
