import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
    userIsAuthencated=false;
    private authListenerSubs! :Subscription;

    constructor(public authService:AuthService) {}

    ngOnInit(): void {
        this.userIsAuthencated=this.authService.getIsAuth();
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthencated=>{
            this.userIsAuthencated=isAuthencated;
        })
    }

    onClickLogout(){
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this.authListenerSubs.unsubscribe();
    }
}