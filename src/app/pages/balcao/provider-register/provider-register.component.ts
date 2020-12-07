import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { VeterinarioModel } from "app/models/veterinarios/VeterinarioModel";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
import { FormUtilService } from "app/shared/form-utils.service";
import { VeterinariosService } from "app/services/veterinarios.service";
import { LocalStorageService } from "angular-2-local-storage";
import { Router } from "@angular/router";
import { UrlRepositoryService } from "app/services/url-repository.service";
import { formatDate } from "@angular/common";
import { ProviderSearchComponent } from "../provider-search/provider-search.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

const CPF = "000.000.000-00";

@Component({
  selector: "provider-register",
  templateUrl: "./provider-register.component.html",
  styleUrls: ["./provider-register.component.scss"],
})
export class ProviderRegisterComponent implements OnInit {
  @Output() returnsearch = new EventEmitter<any>();

  /* Flag de Controle */
  BuscandoVeterinario: boolean = false;
  GravandoVeterinario: boolean = false;

  @Input() resetValue: any;

  cpfMask = CPF;
  cpf = "";
  previusLength = 0;

  formCadastroVeterinario: FormGroup;
  private modeloApi: VeterinarioModel = new VeterinarioModel();
  veterinarioData: VeterinarioModel;
  nome = "";
  dt_contratacao: Date; 
  public VISIBLE: boolean = false;
  readonly: boolean;
  checked: boolean;
  myDate : Date = new Date();
   /*  Flag de controle de modal */
   ModalOpen: boolean = false;

  public constructor(
    private dialog: MatDialogRef<ProviderRegisterComponent>,
    private formBuilder: FormBuilder,
    private VeterinarioService: VeterinariosService,
    private formUtil: FormUtilService,
    private router: Router,
    private url: UrlRepositoryService,
    private mensagem: MensagemService,
    public dialog2: MatDialog,
    public local: LocalStorageService
  ) {
  }

/*** Realiza a pesquisa de um cliente para troca.*/
  dialogProviderSearch() {
    console.log(1);
    let config = new MatDialogConfig();
    config.id = "dialog-provider-search";
    config.data = {
      SuprimirConvenios: true 
    };
    const dialogRef = this.dialog2.open(ProviderSearchComponent, config );
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe(
      (r) => {
        this.ModalOpen = false;
        if (!r) return;
        this.formCadastroVeterinario.value.cpf = r.cpf;
        this.PesquisarVeterinario();
      },
      (erro) => {
        this.ModalOpen = false;
      }
    );
  }

  /* /////////////////////////////// */
  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]|\//;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onCpfChanged() {
    if (this.cpf.length <= 11) {
      this.cpfMask = CPF;
    } else if (
      this.cpf.length === 11 &&
      this.cpfMask === CPF &&
      this.previusLength === 11
    ) {
    }
    this.previusLength = this.cpf.length;
  }

  private get modelo(): VeterinarioModel {
    let model = Object.assign(this.modeloApi, this.formCadastroVeterinario.value);
    model.id = this.veterinarioData != null ? this.veterinarioData.id : 0;
    return model;
  }

  private set modelo(modelo: VeterinarioModel) {
    this.modeloApi = modelo;
    this.formCadastroVeterinario.patchValue({
      id: modelo.id,
      nome: modelo.nome,
      dataContratacao: formatDate(modelo.dataContratacao, 'dd/MM/yyyy', 'pt-BR'), 
      cpf: modelo.cpf, 
      geriatra: modelo.geriatra
    });
  }

  buildForm() {
    /*constrói o formulário reativo*/
    this.formCadastroVeterinario = this.formBuilder.group({
      id: [null],
      cpf: [null],
      nome: [null],
      dataContratacao: [null, Validators.nullValidator],
      geriatra: [false],
       });
  }

  ngOnInit() {
    this.buildForm();
  }

  /* /////////////////////////////// */
  closeDialog() {
    this.dialog.close({});
  }

  /**
   * limpa o formulário de filtro
   */
  limpar(): void {
    if (this.resetValue) {
        this.formCadastroVeterinario.reset(this.resetValue);
    } else {
        this.formCadastroVeterinario.reset();
    }
  }

  public onSubmit(): void {
    this.GravandoVeterinario = true;
    this.formUtil.verificaValidacoes(this.formCadastroVeterinario);
    if (this.formCadastroVeterinario.valid) 
    {
      this.inserirOuAtualizar();
    }
    else {
      this.mensagem.enviar("Existem campos inválidos", false);
    }
  }

  private inserirOuAtualizar(): void {
    if (!this.veterinarioData) {
      console.log(this.modelo);
      this.VeterinarioService.inserir(this.modelo).subscribe(
        () => {
          this.GravandoVeterinario = false;
          this.mensagem.enviar("Dados inseridos com sucesso.");
        },
        (error) => {
          this.GravandoVeterinario = false;
          this.mensagem.enviar("Falha na inclusão do Veterinário.", false);
          console.log(error);
        }
      );
    } else {
      this.VeterinarioService.atualizar(this.modelo).subscribe(
        () => {
          this.GravandoVeterinario = false;
          this.mensagem.enviar("Dados atualizados com sucesso.");
        },
        (error) => {
          this.GravandoVeterinario = false;
          this.mensagem.enviar("Falha na atualização do veterinário", false);
          console.log(error);
        }
      );
    }
  }


PesquisarVeterinario(): void {
    this.formUtil.verificaValidacoes(this.formCadastroVeterinario);
  
 if (this.formCadastroVeterinario.value.cpf === undefined) 
     this.formCadastroVeterinario.value.cpf = this.cpf;
    if (this.formCadastroVeterinario.value.cpf != null) {
      this.BuscandoVeterinario = true;
      var cpf = this.formCadastroVeterinario.value.cpf;

      this.VeterinarioService
        .PesquisarVeterinario(cpf)
        .subscribe((value) => {
          this.BuscandoVeterinario = false;

          if (value == null) {
            this.mensagem.enviar(
              "Veterinário informado não existe ou não encontrado.",
              false
            );
            return;
          }

          this.cpf = value.cpf;
          this.veterinarioData = value;

            /* Converter campo de data de nascimento */
            value.dataContratacao = new Date(value.dataContratacao);
            this.preencherDadosVeterinario(value);

          },(error) => {
          this.mensagem.enviar(
            "Cliente informado não existe ou não encontrado.",
            false
          );
          console.log(error);
        });
        console.log("E");
    } else {
      this.mensagem.enviar(
        "O campo com a pesquisa deve ser preenchido.",
        false
      ); 

    } 
  }

  preencherDadosVeterinario(search: VeterinarioModel) {
    this.formCadastroVeterinario.get("id").patchValue(search.id);
    this.formCadastroVeterinario.get("nome").patchValue(search.nome);
    this.formCadastroVeterinario.get("dt_contratacao").patchValue(search.dataContratacao); 
    this.dt_contratacao = search.dataContratacao; 
  }
  
}
