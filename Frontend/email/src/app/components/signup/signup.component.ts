import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [MessageService]
})
export class SignupComponent {
  form = new FormGroup(
    {
      username: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', Validators.required),
    },
    this.passwordMatchValidator()
  );
  domain = environment.domain;

  constructor(private messageService: MessageService, private userService: UserService, private router: Router) { }

  signup() {
    const username = this.form.get('username')?.value as string;
    const email = `${username}@${this.domain}`;
    const password = this.form.get('password')?.value as string;
    this.userService.signup(email, password).subscribe(
      () => {
        localStorage.setItem('userEmail', email);
        this.router.navigate(['/mail', 'inbox']);
      },
      () => this.showError()
    );
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email already exists. Please log in or choose another email.' });
  }

  private passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
    };
  }

  get passwordMismatch() {
    return this.form.hasError('passwordMismatch') && this.form.get('confirmPassword')?.touched;
  }

  get minLength() {
    return this.form.get('password')?.hasError('minlength') && this.form.get('password')?.touched;
  }
}
