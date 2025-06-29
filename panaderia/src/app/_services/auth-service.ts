import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private username: string = 'amartinez'; 
 private password: string = 'martinez'; // los dejas ''


  setCredentials(username: string, password: string): void {
    this.username = username;
    this.password = password;
  }
  constructor() { }


   getAuthHeader(): string {
    const credentials = btoa(`${this.username}:${this.password}`);
    return `Basic ${credentials}`;
  }

  isLoggedIn(): boolean {
    return this.username !== '' && this.password !== '';
  }

  logout(): void {
    this.username = '';
    this.password = '';
  }
}
