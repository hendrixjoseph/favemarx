import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { RegisterService } from './register.service';
import { Registration } from 'common/registration';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../main/login/login.component.css']
})
export class RegisterComponent {
  @Output() registered = new EventEmitter<void>();

  passwordsMatch: ValidatorFn = group => {
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

  constructor(private formBuilder: FormBuilder,
              private registerService: RegisterService) {}

  onSubmit() {
    this.registerService.register(this.form.value as Registration).subscribe({
      next: () => this.registered.emit()
    })
  }
}
