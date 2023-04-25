import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form = this.formBuilder.nonNullable.group({
    email: [''],
    password: [''],
    passwordAgain: ['']
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmit() {

  }
}
