import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Output() login = new EventEmitter<void>();
  @Output() demo = new EventEmitter<void>();

  error = false;

  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder,
              private loginService: LoginService) {}

  onSubmit() {
    this.loginService.login(this.form.value.email!, this.form.value.password!).subscribe({
      next: () => this.login.emit(),
      error: () => this.error = true
    });
  }

  onDemo() {
    this.demo.emit();
  }
}
