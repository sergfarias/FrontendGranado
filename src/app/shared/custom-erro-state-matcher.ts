import { ErrorStateMatcher } from '@angular/material/core';

export class CustomErroStateMatcher implements ErrorStateMatcher{

    constructor(
        private fn:()=> boolean
    ){}

    isErrorState(): boolean{
        return this.fn();
    }
}