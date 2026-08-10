import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../models/user';
import { map, tap } from 'rxjs';

export interface ILoginCredentialsDto {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private LK_TOKEN = 'TOKEN';
  private BASE_URL = `http://localhost:3000`;
  private http = inject(HttpClient);
  user = signal<User | null | undefined>(undefined);

  login(credentials: ILoginCredentialsDto){
    return this.http.post(this.BASE_URL + `/login`, credentials).pipe(
      tap((result: any) => {
        localStorage.setItem(this.LK_TOKEN, result['token']);
      })
    );
  }

  getConnectedUser(){
    return this.http.get(this.BASE_URL + `/me`).pipe(
      tap((result) => {
        const user = Object.assign(new User(), result);
        this.user.set(user);
      }),
      map(() => this.user())
    );
  }

  logout(){
    return this.http.post(this.BASE_URL + `/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem(this.LK_TOKEN);
        this.user.set(null);
      })
    );
  }
}
