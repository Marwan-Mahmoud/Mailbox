import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {
  passwordHidden: boolean = true;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  
  constructor(private messageService: MessageService, private userService: UserService, private router: Router) { }

  login() {
    const email = this.form.get('email')?.value as string;
    const password = this.form.get('password')?.value as string;
    this.userService.login(email, password).subscribe(
      () => {
        localStorage.setItem('userEmail', email);
        this.router.navigate(['/mail', 'inbox']);
      },
      () => this.showError()
    );
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Incorrect email or password.' });
  }
}
