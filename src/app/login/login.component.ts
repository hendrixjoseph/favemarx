import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Output() login = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();

  form = this.formBuilder.nonNullable.group({
    email: [''],
    password: ['']
  });

  constructor(private formBuilder: FormBuilder) {}

  onRegister() {
    this.register.emit();
  }

  onSubmit() {
    this.login.emit();
  }
}
