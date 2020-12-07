import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Confirmacao } from './confirmacao.model';
import { IfStmt } from '@angular/compiler';

@Component({
    template:`
        <div mat-dialog-content>
            <p class="mensagem">{{ dados.mensagem }}</p>
        </div>
        <div mat-dialog-actions>
            <button mat-button (click)="confirmar()" *ngIf="!IsAlerta" cdkFocusInitial>{{ dados.lblConfirmar }}</button>
            <button mat-button (click)="fechar()" *ngIf="!IsAlerta">{{ dados.lblCancelar }}</button>

            <button mat-button (click)="fechar()" *ngIf="IsAlerta" cdkFocusInitial>OK</button>
        </div>
    `,
    styles:[`
        [mat-dialog-actions]{ display:flex; justify-content:flex-end; }
    `]
})
export class ConfirmacaoComponent {
    constructor(
        private dialogRef:MatDialogRef<ConfirmacaoComponent>,
        @Inject(MAT_DIALOG_DATA) public dados:Confirmacao
    ) { 
        if(dados?.IsAlerta)
            this.IsAlerta = true;
    }

    IsAlerta: boolean = false;

    fechar(): void {
        this.dialogRef.close(false);
    }

    confirmar(): void {
        this.dialogRef.close(true);
    }
}