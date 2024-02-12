import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
    selector: 'app-login',
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
})

export class LoginComponent{
    isLoading=false;

    constructor(public authService:AuthService) {}

    onLogin(formData:NgForm){
        if(formData.invalid){
            return;
        }
        this.isLoading=true;
        this.authService.loginUser(formData.value.email, formData.value.password);
    }
}