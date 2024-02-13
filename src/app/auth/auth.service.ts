import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public token: any;
    private isAuthenticated = false;
    public tokenTimer: any;
    public authStatusListener = new Subject<boolean>();
    private userId: any;
    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http
            .post('http://localhost:3000/api/user/signup', authData)
            .subscribe((response) => {
                this.router.navigate(['/']);
            });
    }

    loginUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http
            .post<{ token: string, expiresIn: number, userId: string }>(
                'http://localhost:3000/api/user/login',
                authData
            )
            .subscribe((response) => {
                const token = response.token;
                this.token = token;
                if (token) {
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    const tokenExpiresIn = response.expiresIn;
                    this.setAuthTimer(tokenExpiresIn);
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(
                        now.getTime() + tokenExpiresIn * 1000
                    );
                    this.saveAuthData(token, expirationDate,this.userId);
                    this.router.navigate(['/']);
                }
            });
    }

    autoAuthUser() {
        const authInformation: any = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        clearTimeout(this.tokenTimer);
        this.authStatusListener.next(false);
        this.userId = null;
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        console.log("Setting Timer: " + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expiration: Date,userId:string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expiration.toISOString());
        localStorage.setItem('userId',userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId:userId
        }
    }
}
