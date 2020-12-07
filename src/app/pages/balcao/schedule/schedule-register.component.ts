import { Component, OnInit, Input, EventEmitter, Output, ViewChild, Inject, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

import { AnimalModel } from "app/models/base/AnimalModel";
import { ClienteModel } from "app/models/clientes/ClienteModel";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
import { FormUtilService } from "app/shared/form-utils.service";
import { AnimalService } from "app/services/animal.service";
import { ClientesService } from "app/services/clientes.service";
import { AgendamentoService } from "app/services/agendamento.service";
import { AnimalRegisterComponent } from "../animal-register/animal-register.component";
import { LocalStorageService } from "angular-2-local-storage";
import { AgendamentoModel } from "app/models/agendamento/AgendamentoModel";
import { Router } from "@angular/router";
import { UrlRepositoryService } from "app/services/url-repository.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";

const CPF = "000.000.000-00";

@Component({
  selector: "schedule-register",
  templateUrl: "./schedule-register.component.html",
  styleUrls: ["./schedule-register.component.scss"],
})
export class ScheduleRegisterComponent implements OnInit {

  displayedColumns = [
    "clienteId",
    "id",
    "RADIO",
    "nome",
    "idade",
    "tipoAnimalId",
    "tipoAnimalNome" 
  ];
  public dataTable: AnimalModel[];
  public dataSource: MatTableDataSource<AnimalModel>;

  @Output() returnsearch = new EventEmitter<any>();

  /* Flag de Controle */
  BuscandoAgendamento: boolean = false;
  GravandoAgendamento: boolean = false;

  BuscandoCliente: boolean = false;
  GravandoCliente: boolean = false;

  @Input() resetValue: any;

  CpfMask = CPF;
  CPF = "";
  previusLength = 0;

  formCadastroAgendamento: FormGroup;
  public animais: AnimalModel[] = [];
  private modeloApi: ClienteModel = new ClienteModel();
  clienteData: ClienteModel;
  NOME = "";
  public VISIBLE: boolean = false;
  readonly: boolean;
  checked: boolean;
  myDate : Date = new Date();
   /*  Flag de controle de modal */
   ModalOpen: boolean = false;
   valdata: AnimalModel;
   AnimalRegisterAwaiter: Subject<any> = new Subject<any>();
   
   public SelectedAnimalModel: AnimalModel;

   @Output() animalSelected = new EventEmitter<AnimalModel>();
   @Output() sourceChanged = new EventEmitter<any>();
 
   selectedAnimal: string = "";

   geriatra: boolean = false;
   horario: string =""; 
   horarioid: number=0;
   veterinarioid: number=0;
   dataAgendamento: string ="";

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialogRef<ScheduleRegisterComponent>,
    private formBuilder: FormBuilder,
    private animalService: AnimalService,
    private clienteService: ClientesService,
    private agendamentoService: AgendamentoService,
    private formUtil: FormUtilService,
    private router: Router,
    private url: UrlRepositoryService,
    private mensagem: MensagemService,
    public dialog2: MatDialog,
    public local: LocalStorageService,
    public change: ChangeDetectorRef
  ) {

    if (data != null) {
       console.log(data.Horario + " - data:" + data.DataContratacao);
       this.geriatra = data.Horario.geriatra;
       this.horario = data.Horario.horario; 
       this.horarioid= data.Horario.id;
       this.veterinarioid= data.Horario.veterinarioid;
       this.dataAgendamento= data.DataContratacao;
    }

    }

  /* ngAfterViewChecked(){
    //your code to update the model
    this.change.detectChanges();
 } */
 
  public checkedAnimalId: number;

  /* /////////////////////////////// */
  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]|\//;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onCnpjCpfChanged() {
    if (this.CPF.length <= 11) {
      this.CpfMask = CPF;
    } else if (
      this.CPF.length === 11 &&
      this.CpfMask === CPF &&
      this.previusLength === 11
    ) {
    }
    this.previusLength = this.CPF.length;
  }

  private get modelo(): ClienteModel {
    let model = Object.assign(this.modeloApi, this.formCadastroAgendamento.value);
    model.animais  = this.dataTable;
    model.id = this.clienteData != null ? this.clienteData.id : 0;
    return model;
  }

  private set modelo(modelo: ClienteModel) {
    this.modeloApi = modelo;
    this.formCadastroAgendamento.patchValue({
      id: modelo.id,
      nome: modelo.nome,
      cpf: modelo.cpf, 
      animais: modelo.animais,
    });
  }

  buildForm() {
    /*constrói o formulário reativo*/
    this.formCadastroAgendamento = this.formBuilder.group({
      id: [null],
      cpf: [null],
      nome: [null],
      TERMO: [null],
      animais: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.buildForm();
    this.AnimalRegisterAwaiter.subscribe((resp) => {
      if (!resp) return;
      this.atualizarGrid(resp);
    });
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
        this.formCadastroAgendamento.reset(this.resetValue);
    } else {
        this.formCadastroAgendamento.reset();
    }
  }

  public onSubmit(): void {
    this.GravandoAgendamento = true;
      this.inserirOuAtualizar();
  }

  private inserirOuAtualizar(): void {
      if (this.modelo.cpf==""){
        this.mensagem.enviar("Digite um CPF.");
        return
      }
      if (this.modelo.nome==""){
        this.mensagem.enviar("Digite um nome.");
        return
      }
      
      var agendamento:  AgendamentoModel;
      agendamento = new AgendamentoModel;
      agendamento.id=0;
      agendamento.clienteid = this.modelo.id;
      agendamento.veterinarioId = this.veterinarioid;
      agendamento.dataConsulta = this.dataAgendamento;
      agendamento.horario = this.horario;

     if ((this.checkedAnimalId ===undefined)||(this.checkedAnimalId==0)){
      this.mensagem.enviar("Selecione um animal.");
      return
     }

      agendamento.animalid = this.checkedAnimalId;
     
      this.agendamentoService.inserir(agendamento).subscribe(
        () => {
          this.GravandoAgendamento = false;
          this.mensagem.enviar("Dados inseridos com sucesso.");
        },
        (error) => {
          this.GravandoAgendamento = false;
          this.mensagem.enviar(error.error.errors, false);
          console.log(error);
        }
      );
  }


PesquisarClienteGrid(): void {
    this.formUtil.verificaValidacoes(this.formCadastroAgendamento);
    if (this.formCadastroAgendamento.value.cnpjCpf === undefined) 
        this.formCadastroAgendamento.value.cnpjCpf = this.CPF;

    if (this.formCadastroAgendamento.value.cpf != null) {
      this.BuscandoCliente = true;
      var cpf = this.formCadastroAgendamento.value.cpf;

      this.clienteService
        .PesquisarClienteCPF(cpf)
        .subscribe((value) => {
          this.BuscandoCliente = false;

          if (value == null) {
            this.mensagem.enviar(
              "Cliente informado não existe ou não encontrado.",
              false
            );
            return;
          }

          this.CPF = value.cpf;
          this.clienteData = value;
          this.preencherDadosCliente(value);
        },(error) => {
          this.mensagem.enviar(
            "Cliente informado não existe ou não encontrado.",
            false
          );
          console.log(error);
        });

        console.log("E");
       this.animalService
        .PesquisarAnimalGrid(cpf) //animal -- Logradouro
        .subscribe(
          (value) => {
            console.log(value);
            this.preencherDados(value);
          },
          (error) => {
            this.mensagem.enviar(
              "Cliente informado não existe ou não encontrado.",
              false
            );
            console.log(error);
          }
        );
    } else {
      this.mensagem.enviar(
        "O campo com a pesquisa deve ser preenchido.",
        false
      ); 

    } 
  }


  preencherDados(search) {
    console.log("F");
    var saida: Array<AnimalModel>[] = [];
    console.log(search);
    this.dataTable = search; //saida[0];
    this.dataSource = new MatTableDataSource<any>(this.dataTable);
    this.sourceChanged.emit();
  }

   preencherDadosCliente(search: ClienteModel) {
    this.formCadastroAgendamento.get("id").patchValue(search.id);
    this.formCadastroAgendamento.get("nome").patchValue(search.nome);
  }
  
  dialogAnimalRegister() {
    const dialogRef = this.dialog2.open(AnimalRegisterComponent, {
      id: "animal-register",
      data: [(this.valdata = this.valdata)],
    });

    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe((resp) => {
      this.AnimalRegisterAwaiter.next(resp);
      this.ModalOpen = false;
    });
  }

  atualizarGrid(modelo: AnimalModel) {
    console.log(modelo);
    if (!this.dataTable) {
      this.dataTable = [];
      if (modelo.id==0) modelo.id = this.dataTable.length + 1;
    }
    else{

      let contador: number=0;
      for (let c = 0; c < this.dataTable.length - 1; c++) {
        contador = this.dataTable[c].id;
      }
      if (modelo.id==0) modelo.id = contador + 1;
    }

    let animal = this.dataTable.filter(
      (v) => v.id == modelo.id
    );

    if (animal.length == 0) {
      modelo.RADIO = false;
      this.dataTable.push(modelo);
      this.radioChangeHandler(modelo, null);
    } else {
      let value = animal[0];
      modelo.RADIO = false;
      Object.assign(value, modelo);
    }

    this.dataSource = new MatTableDataSource<any>(this.dataTable);
    this.change.markForCheck();

    this.sourceChanged.emit();
  }

  radioChangeHandler(row: any, event: any) {
    this.selectedAnimal = row;
    this.checkedAnimalId = parseInt(row.id);
    console.log("animal",this.checkedAnimalId);
    this.SelectedAnimalModel = row;
    this.animalSelected.emit(row);
  }

}
