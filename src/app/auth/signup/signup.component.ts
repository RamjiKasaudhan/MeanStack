import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
    selector: 'app-signup',
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})

export class SignupComponent{
    isLoading=false;

    constructor(public authService:AuthService) {}

    onSignup(formData:NgForm){
        if(formData.invalid){
            return;
        }
        this.isLoading=true;
        this.authService.createUser(formData.value.email, formData.value.password);
    }
}