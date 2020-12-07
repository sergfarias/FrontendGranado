import { Confirmacao } from './confirmacao.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacaoComponent } from './confirmacao.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({providedIn:'root'})
export class MensagemService {

    constructor(
        public snackBar:MatSnackBar,
        public dialog:MatDialog
    ){
        console.log('# MensagemService');
    }

    enviar(msg:string, sucesso:boolean = true):void{
        if(sucesso)
            this.enviarSucesso(msg);
        else
            this.enviarErro(msg)
    }

    warning(msg:string):void{
        this.snackBar.open(msg, 'FECHAR', { panelClass: 'warning', duration: 5000 });
    }

    private enviarSucesso(msg:string):void{
        this.snackBar.open(msg, 'FECHAR', {
            duration: 6000
        });
    }

    private enviarErro(msg:string):void{
        this.snackBar.open(msg, 'FECHAR' , {
            panelClass: 'erro',
            duration: 10000
        });
    }

    confirmar(msg:string, 
                btnConfirmar:string = 'OK', 
                btnCancelar:string = 'Cancelar',
                largura = "480px",
                alerta: boolean = false):Observable<boolean> {
        const confirmacao:Confirmacao = {
            mensagem: msg,
            lblCancelar: btnCancelar,
            lblConfirmar: btnConfirmar,
            IsAlerta: alerta
        };

        return this.dialog.open(ConfirmacaoComponent, {
            width: largura,
            disableClose: true,
            data: confirmacao
        })
        .beforeClosed();
    }
}
