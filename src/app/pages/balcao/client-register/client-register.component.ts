import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { AnimalModel } from "app/models/base/AnimalModel";
import { ClienteModel } from "app/models/clientes/ClienteModel";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
import { FormUtilService } from "app/shared/form-utils.service";
import { AnimalService } from "app/services/animal.service";
import { ClientesService } from "app/services/clientes.service";
import { ContactService } from "app/services/contact.service";
import { AnimalRegisterComponent } from "../animal-register/animal-register.component";
import { LocalStorageService } from "angular-2-local-storage";
import { ContactModel } from "app/models/base/ContactModel";
import { Router } from "@angular/router";
import { UrlRepositoryService } from "app/services/url-repository.service";
import { ClientSearchComponent } from "../client-search/client-search.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { SystemService } from "app/services/system.service";
import { MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";

const CPF = "000.000.000-00";
const CELULAR = "(00) 00000-0000";
const TELEFONE = "(00) 0000-0000";

@Component({
  selector: "client-register",
  templateUrl: "./client-register.component.html",
  styleUrls: ["./client-register.component.scss"],
})
export class ClientRegisterComponent implements OnInit {

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
  BuscandoCliente: boolean = false;
  GravandoCliente: boolean = false;

  @Input() resetValue: any;

  CpfMask = CPF;
  CPF = "";
  ID_CONTATO = 0;
  ID_TIPO_CONTATO = "";
  DS_CONTATO = "";
  previusLength = 0;

  listTipoContato: any[] = [];
  formCadastroCliente: FormGroup;
  public animais: AnimalModel[] = [];
  public contatos: FormArray;
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
  
  public constructor(
    private dialog: MatDialogRef<ClientRegisterComponent>,
    private formBuilder: FormBuilder,
    private animalService: AnimalService,
    private contactService: ContactService,
    private clienteService: ClientesService,
    private formUtil: FormUtilService,
    private router: Router,
    private url: UrlRepositoryService,
    private mensagem: MensagemService,
    public dialog2: MatDialog,
    public local: LocalStorageService,
    private system: SystemService,
    public change: ChangeDetectorRef
    
  ) {
  }

  /* ngAfterViewChecked(){
    //your code to update the model
    this.change.detectChanges();
 } */

  public checkedAnimalId: number;

  getMascara(c: any, i: any) {
    //console.log(1);
    if (!c) return;
    let ID_TIPO_CONTATO = c.value?.id_tipo_contato;
    if (ID_TIPO_CONTATO == 1) return CELULAR;
    else if (ID_TIPO_CONTATO == 2) return TELEFONE;
    else null;
  }

/**
   * Realiza a pesquisa de um cliente para troca.
   */
  dialogClientSearch() {
    let config = new MatDialogConfig();
    config.id = "dialog-client-search";
    config.data = {
      SuprimirConvenios: true 
    };
    const dialogRef = this.dialog2.open(ClientSearchComponent, config );
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe(
      (r) => {
        this.ModalOpen = false;
        if (!r) return;
        this.formCadastroCliente.value.cnpjCpf = r.cnpjCpf;
        this.PesquisarClienteGrid();
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

  onCnpjCpfChanged() {
    if (this.CPF.length <= 11) {
      this.CpfMask = CPF;
    } else if (
      this.CPF.length === 11 &&
      this.CpfMask === CPF &&
      this.previusLength === 11
    ) {
      //this.cnpjCpfMask = CNPJ;
    }
    this.previusLength = this.CPF.length;
  }

  private get modelo(): ClienteModel {
    let model = Object.assign(this.modeloApi, this.formCadastroCliente.value);
    model.animais  = this.dataTable;
    console.log(5,model.animais);
    model.id = this.clienteData != null ? this.clienteData.id : 0;
    model.contatos = model.contatos.filter((c) => c.id_tipo_contato != null);
    return model;
  }

  private set modelo(modelo: ClienteModel) {
    this.modeloApi = modelo;
    console.log(modelo);

    this.formCadastroCliente.patchValue({
      id: modelo.id,
      nome: modelo.nome,
      cpf: modelo.cpf, 
      animais: modelo.animais,
      contatos: modelo.contatos,
    });
  }

  buildForm() {
    /*constrói o formulário reativo*/
    this.formCadastroCliente = this.formBuilder.group({
      id: [null],
      cpf: [null],
      //DT_CAD: [new Date()],
      nome: [null],
      observacao: [null],
      TERMO: [null],
      animais: this.formBuilder.array([]),
      contatos: this.formBuilder.array([this.createContact()]),
    });
  }

  createContact(): FormGroup {
    return this.formBuilder.group({
      id_contato: [0],
      id_tipo_contato: [null],
      ds_contato: [""],
    });
  }

  public addNewContact(): void {
    this.contatos = this.formCadastroCliente.get("contatos") as FormArray;
    this.contatos.push(this.createContact());
  }

  ngOnInit() {
    this.buildForm();
    this.recuperarDropdownTipoContato();
    this.AnimalRegisterAwaiter.subscribe((resp) => {
      if (!resp) return;
      console.log(4444);
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
        this.formCadastroCliente.reset(this.resetValue);
    } else {
        this.formCadastroCliente.reset();
    }
    this.formCadastroCliente.get("DT_CAD").patchValue(new Date);
  }

  recuperarDropdownTipoContato() {
    console.log("t");
    this.contactService.recuperarDropdownTipoContato().subscribe((values) => {
      this.listTipoContato = values;
    });
  }

  public onSubmit(): void {
    this.GravandoCliente = true;

    this.formUtil.verificaValidacoes(this.formCadastroCliente);
    if (this.formCadastroCliente.valid) 
    {
      this.inserirOuAtualizar();
    }
    else {
      this.mensagem.enviar("Existem campos inválidos", false);
    }
  }

  private inserirOuAtualizar(): void {
    console.log(1);
    if (!this.clienteData) {

      if (this.modelo.cpf==""){
        this.mensagem.enviar("Digite um CPF.");
        return
      }
      if (this.modelo.nome==""){
        this.mensagem.enviar("Digite um nome.");
        return
      }
      
      this.clienteService.inserir(this.modelo).subscribe(
        () => {
          this.GravandoCliente = false;
          this.mensagem.enviar("Dados inseridos com sucesso.");
        },
        (error) => {
          this.GravandoCliente = false;
          this.mensagem.enviar(error.error.errors, false);
          console.log(error);
        }
      );
    } else {
      //this.clienteService.atualizar(this.modelo).subscribe(
        this.clienteService.inserir(this.modelo).subscribe(
        () => {
          this.GravandoCliente = false;
          this.mensagem.enviar("Dados atualizados com sucesso.");
        },
        (error) => {
          this.GravandoCliente = false;
          this.mensagem.enviar(error.error.errors, false);
          console.log(error);
        }
      );
    }
  }


PesquisarClienteGrid(): void {
    this.formUtil.verificaValidacoes(this.formCadastroCliente);
 if (this.formCadastroCliente.value.cnpjCpf === undefined) 
     this.formCadastroCliente.value.cnpjCpf = this.CPF;

    if (this.formCadastroCliente.value.cpf != null) {

       this.clienteService
        .PesquisarClienteContato(this.formCadastroCliente.value.cpf)
        .subscribe((value) => {
          this.PreencherDadosClienteContato(value);
        }); 
      
      this.BuscandoCliente = true;
      var cpf = this.formCadastroCliente.value.cpf;

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
          //}
        },(error) => {
          this.mensagem.enviar(
            "Cliente informado não existe ou não encontrado.",
            false
          );
          console.log(error);
        }
        
        
        );

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
    this.formCadastroCliente.get("id").patchValue(search.id);
    this.formCadastroCliente.get("nome").patchValue(search.nome);
  }

  /**
   * Após realizar a busca pelo cpf/cnpj, os dados do contato do cliente são preenchidos nos inputs.
   */
  PreencherDadosClienteContato(search: any) {
    if (search != null) {
      var saida: Array<ContactModel>[] = [];
      for (let c = 0; c < search.length - 1; c++) {
        this.addNewContact();
      }
      this.formCadastroCliente.get("contatos").patchValue(search); 
    }
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
    this.checkedAnimalId = parseInt(row.animalId);

    this.SelectedAnimalModel = row;
    this.animalSelected.emit(row);
  }

}
