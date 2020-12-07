import { Input, Injector, OnChanges, DoCheck } from '@angular/core';
import { ControlValueAccessor, FormControl, FormControlName } from '@angular/forms';

import { CustomErroStateMatcher } from './custom-erro-state-matcher';
import { FormUtilService } from './form-utils.service';

export class BaseInput implements ControlValueAccessor, OnChanges, DoCheck{
    @Input() dica:string;
    @Input() label:string;
    @Input() somenteLeitura:boolean = false;

    onChange:(value:any)=> void = () => {};
    onTouched:()=> void = () => {};

    errorState: CustomErroStateMatcher;
    campoInterno = new FormControl();

    protected controle:FormControl;

    constructor(
        protected util:FormUtilService,
        protected injector:Injector
    ) {
        this.errorState = new CustomErroStateMatcher(this.exibirErro.bind(this));
    }

    protected recuperarControle():void {
        try {
            if(!this.controle)
                this.controle = this.injector.get(FormControl) as FormControl;
        } catch (error) {
            console.warn('# Não foi possível recuperar o NgControl, utilize o atributo formControlName ou ngModel no input customizado.');
        }
    }
    //este evento em alguns casos não roda
    ngOnChanges(){
        //this.recuperarControle();
    }
    //este evento é um fallback para o de cima
    ngDoCheck(){
        //this.recuperarControle();
    }

    exibirErro():boolean{
        return this.util.exibirErro(this.controle);
    }

    marcarComErro():void{

        if(this.controle){
            if(this.controle instanceof FormControlName )
                this.controle.control.setErrors({selecaoInvalida: true});
        }
    }

    recuperarMensagem():string{
        return this.util.recuperarMensagem(this.controle);
    }

    writeValue(obj: any): void {
        this.campoInterno.setValue(obj, { emitEvent: false });
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.somenteLeitura = isDisabled;
    }
}