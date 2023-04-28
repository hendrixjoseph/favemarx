import { Component } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../main/login/login.component.css']
})
export class RegisterComponent {
  passwordsMatch: ValidatorFn = group => {
    console.log(group);

    let p1 = group.get('password')?.value;
    let p2 = group.get('passwordAgain')?.value;

    return p1 === p2 ? null : { notSame: true };
  };

  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    passwordAgain: ['', Validators.required]
  }, {
    validators: this.passwordsMatch
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmit() {

  }
}
