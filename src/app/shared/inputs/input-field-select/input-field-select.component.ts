import { Component, Injector, Input, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';

import { INPUT_FIELD_VALUE_ACCESSOR } from '../../input-field-value-acessor';
import { FormUtilService } from '../../form-utils.service';
import { BaseInput } from '../../base-input';
import { MatSelect } from '@angular/material/select';

@Component({
    selector: 'app-input-field-select',
    templateUrl: './input-field-select.component.html',
    styleUrls: ['../../input-field.component.scss'],
    providers: [ INPUT_FIELD_VALUE_ACCESSOR(InputFieldSelectComponent) ]
})
export class InputFieldSelectComponent extends BaseInput implements OnInit{

    @Input() lista:any[] = [];
    @Input() itemDisplay:string;
    @Input() itemValue:string;
    @Input() removerSelecione = false;

    @ViewChild("selectInterno") private select: MatSelect;

    @Output() public get selectInterno(): MatSelect {
        return this.select;
    }

    public aberto: boolean = false;

    private Exibir: boolean = false;

    constructor(
        util: FormUtilService,
        injector: Injector
    ) { super(util, injector) }

    ngOnInit(){
        this.campoInterno.valueChanges.subscribe(value => this.onChange(value));
    }

    openChanged(isOpen) {
        this.aberto = isOpen;
        
        if(!this.Exibir) this.select.panelClass = "hidden"
        else this.select.panelClass = ""
    }

    enterKey(event) {
        this.select.close();
    }
}
