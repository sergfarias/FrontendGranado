import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormUtilService {

	verificaValidacoes(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(campo => {
			const controle = formGroup.get(campo);
			controle.markAsDirty();
			if (controle instanceof FormGroup) {
				this.verificaValidacoes(controle);
			}
		});
    }

    removeValidacoes(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(campo => {
			const controle = formGroup.get(campo);
			controle.clearValidators();
			if (controle instanceof FormGroup) {
				this.removeValidacoes(controle);
			}
		});
    }

    exibirErro(control:FormControl):boolean{
        if(!control)
            return false;

        return control.invalid && (control.touched || control.dirty);
    }

    recuperarMensagemErro(control:FormControl):string{
        if(control.invalid){
            for(const validatorName in control.errors){
                if(control.errors.hasOwnProperty(validatorName)){
                    return this.getMessage(validatorName, control.errors[validatorName]);
                }
            }
        }

        return null;
    }

    recuperarMensagem(control:FormControl):string{
        if(this.exibirErro(control)){
            for(const validatorName in control.errors){
                if(control.errors.hasOwnProperty(validatorName)){
                    return this.getMessage(validatorName, control.errors[validatorName]);
                }
            }
        }

        return null;
    }

    getAcaoDaRota(url:string):string {
        let inicioSemBarra = (url.lastIndexOf("/") + 1);
        let acao = url.substring(inicioSemBarra, url.length);
        return acao;
    }

    private getMessage(validatorName:string, validator:any = {}):string{
        const mensagens: {[key:string]:string} = {
            comErro: '',
            date:'Data inválida.',
            dateMenorOuIgual:`Deve ser menor ou igual a ${validator.outroCampo}.`,
            dateMaiorOuIgual:`Deve ser maior ou igual a ${validator.outroCampo}.`,
            dateMaiorQue:`Deve ser maior que ${validator.outroCampo}.`,
            dateMenorQue:`Deve ser menor que ${validator.outroCampo}.`,
            duration: 'Duração inválida.',
            email:'E-mail inválido.',
            filesNomeDuplicado: `Arquivo com nome ${validator.nomeArquivo} já existe.`,
            filesQuantidadeMaxima: `Número máximo de arquivos excedido.`,
            filesTamanhoTotal: `Arquivo com tamanho maior do que o permitido.`,
            hora: 'Hora inválida.',
            matDatepickerParse: 'Data inválida.',
            minlength:'Valor mínimo inválido.',
            numeroItem: 'Número inválido.',
            required: 'Obrigatório.',
            selecaoInvalida: 'Seleção Inválida.',
            umOuOutroInformado: `${validator.campo1} e/ou ${validator.campo2} obrigatório.`,
            tempoDeEmergencia: 'Tempo de Emergência inválido.',
            pattern: 'Inválido.',
            periodoMaximo: `Período de pesquisa não pode ultrapassar ${validator.periodo} dias.`
        }

        return mensagens[validatorName];
    }
}
