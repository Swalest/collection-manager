import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { ILoginCredentialsDto, LoginService } from '../../services/login/login-service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  
  private subscriptions = new Subscription();
  
  loginFormGroup = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
          });

  invalidCredentials = signal(false);

  login(){
    const loginSubscription = this.loginService.login(
          this.loginFormGroup.value as ILoginCredentialsDto
        ).subscribe({
          next: () => this.getUserInformation(),
          error: () => this.invalidCredentials.set(true)
        });
    this.subscriptions.add(loginSubscription);
  }

  getUserInformation(){
    const getUserSubscription = this.loginService.getConnectedUser().subscribe(
          user => {
            this.navigateHome();
          });

    this.subscriptions.add(getUserSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  navigateHome(){
    this.router.navigate(['home']);
  }
}
