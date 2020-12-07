import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Inject,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import {
  MatDialogRef,
  MatDialogConfig,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ClientesService } from "app/services/clientes.service";
import { ClienteModel } from "app/models/clientes/ClienteModel";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormUtilService } from "app/shared/form-utils.service";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
//import { MatSelectChange } from "@angular/material/select";
//import { PesquisaConvenioModel } from "app/models/convenios/PesquisaConvenioModel";
//import { Subject } from "rxjs";
//import { DiscountCardComponent } from "../discount-card/discount-card.component";
import { ScrollGridColumn } from "app/shared/components/scroll-grid/scroll-grid.component";

const CPF = "000.000.000-00";
const CNPJ = "00.000.000/0000-00";
const TELEFONE = "(00) 0000-0000";
const CELULAR = "(00) 00000-0000";

@Component({
  selector: "app-client-search",
  templateUrl: "./client-search.component.html",
  styleUrls: ["./client-search.component.scss"],
})
export class ClientSearchComponent implements OnInit {
  cnpjCpfMask = CPF;
  previusLength = 0;
  Termo = "";
  selected = null;
  cnpjCpfMask2 = CPF;

  array = [
    { name: "Código", key: 1 },
    { name: "Nome", key: 2 },
    { name: "CPF/CNPJ", key: 3 },
    { name: "Telefone", key: 4 },
    //{ name: "Carteirinha", key: 5 },
  ];

  @ViewChild("pesquisaInput") pesquisaInput: ElementRef;

  displayedColumns = [
    ScrollGridColumn.setup({MemberName: "id", DisplayName: "Código", Width: 20}),
    ScrollGridColumn.setup({MemberName: "nomeFantasia", DisplayName: "Nome", Width: 50}),
    ScrollGridColumn.setup({MemberName: "cnpjCpf", DisplayName: "CPF/CNPJ", Width: 30})
  ];

  private dataTable: ClienteModel[];
  private dataSource: ClienteModel[] = [];
  private modeloApi: ClienteModel = new ClienteModel();
  private formSearch: FormGroup;
  IsPesquisando: boolean = false;

  SuprimirConvenios: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public change: ChangeDetectorRef,
    private clientesService: ClientesService,
    private dialog: MatDialogRef<ClientSearchComponent>,
    private formBuilder: FormBuilder,
    private formUtil: FormUtilService,
    private mensagem: MensagemService,
    private dialogSvc: MatDialog
  ) {
    /* if (data != null) {
      if (data.SuprimirConvenios) {
        this.SuprimirConvenios = data.SuprimirConvenios;
      }
    } */

    /* this.SelecionarConvenioAwaiter.subscribe((resp) => {
      let cliente = this.DadosCliente;
      cliente.Convenio = resp;
      this.dialog.close(cliente);
    }); */
  }

  public DadosCliente: ClienteModel;

  /* SelecionarConvenioAwaiter: Subject<PesquisaConvenioModel> = new Subject<
    PesquisaConvenioModel
  >();
 */
  public get modelo(): ClienteModel {
    let modelo = Object.assign(
      Object.assign({}, this.modeloApi),
      this.formSearch.value
    ) as ClienteModel;

    return modelo;
  }

  public set modelo(modelo: ClienteModel) {
    this.modeloApi = modelo;
    this.formSearch.patchValue({
      Termo: modelo.Termo,
    });
  }

  buildForm() {
    /*constrói o formulário reativo*/
    this.formSearch = this.formBuilder.group({
      Termo: [null, Validators.required],
      selected: [this.array[2].key, Validators.required],
    });

    this.selected = this.array[2].key;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pesquisaInput.nativeElement.select();
      this.pesquisaInput.nativeElement.focus();
    }, 300);
  }

  Pesquisar(): void {
    this.formUtil.verificaValidacoes(this.formSearch);

    if (!this.formSearch.valid) return;

    if (this.formSearch.value.Termo != null) {
      const { Termo } = Object.assign({}, this.formSearch.value);
      const { selected } = Object.assign({}, this.formSearch.value);
      this.IsPesquisando = true;

      if (selected==5){ // busca carteirinha
          // this.buscaConvenio(Termo);
      }
      else{ 

            this.clientesService.PesquisarClienteCampo(Termo, selected).subscribe(
              (value) => {
                if (value.length > 0) {
                  this.preencherDados(value); 
                } 
                else { 
            
                 /*  if ((selected==3)&&(!this.SuprimirConvenios)){ ///se CPF ou CNPJ e se não encontro no DB vai ao Fidelize e ao gateeay
                      this.buscaConvenio(Termo);
                  }
                  else
                  {
 */                      this.mensagem.enviar("Cliente informado não existe ou não encontrado.",false);
                 // }
                }

                this.IsPesquisando = false;
              },
              (error) => {
                this.IsPesquisando = false;
                this.mensagem.enviar(
                  "Cliente informado não existe ou não encontrado.",
                  false
                );
                console.log(error);
              }
            );
      }
    } else {
      this.mensagem.enviar(
        "O campo com a pesquisa deve ser preenchido.",
        false
      );
    }
  }


/* buscaConvenio(Termo){
  var cli: ClienteModel;
  cli = new ClienteModel;
  cli.cnpjCpf = Termo; 
  console.log(5);

  let config = new MatDialogConfig();
  config.id = "dialog-convenio";
  config.width = "650px";
  config.maxHeight = "600px";
  config.data = {TermoPesquisa: cli.cnpjCpf,};

  const dialogRef = this.dialogSvc.open(DiscountCardComponent, config);
  dialogRef.afterClosed().subscribe(
  (result) => {
    if (result){
      this.SuprimirConvenios = true; 
      cli.Convenio = result;
      cli.id = cli.Convenio.ID_CLIENTE;
      cli.cnpjCpf = cli.Convenio.CNPJ_CPF;
      cli.nomeFantasia = cli.Convenio.NM_FANTASIA;
      cli.razaoSocial = cli.Convenio.RZ_CLIENTE;
      this.selecionarCliente(cli);
    } 
    else
      this.mensagem.enviar("Cliente informado não existe ou não encontrado.",false);
},
(erro) => {
      this.mensagem.enviar("Cliente informado não existe ou não encontrado.",false);
}
);
}
 */

  /**
   * Seleciona o cliente e retorna como parâmetro de resultado do modal.
   * @param cliente Cliente selecionado.
   */
  selecionarCliente(cliente) {
    this.DadosCliente = cliente;
    console.log(this.SuprimirConvenios)
    //if (this.SuprimirConvenios) {
      this.dialog.close(cliente);
    //} else {
    //  this.selecionarConvenio(cliente);
    //}
  }

  /**
   * Pesquisar dados de convênio do cliente
   * @param cliente Cliente a ser pesquisado no serviço de convênios
   */
  /* selecionarConvenio(cliente: ClienteModel) {
    
    let config = new MatDialogConfig();
    config.id = "dialog-convenio";
    config.width = "650px";
    config.maxHeight = "600px";
    config.data = {
      TermoPesquisa: cliente.cnpjCpf, //"06952688722"
    };

    const dialogRef = this.dialogSvc.open(DiscountCardComponent, config);

    dialogRef.afterClosed().subscribe(
      (result) => {
        this.SelecionarConvenioAwaiter.next(result);
      },
      (erro) => {
        this.SelecionarConvenioAwaiter.next(null);
      }
    );
  }
 */
  /**
   * Após realizar a busca pelo cpf/cnpj, nome e código, os dados do cliente são preenchidos no datatable
   */
  preencherDados(search) {
    /* var saida: Array<ClienteModel>[] = [];
    for (let i = 0; i < Object.values(search).length / 13; i++) {
      //pego cada coluna
      var customObj: Array<ClienteModel> = [];
      Object.keys(search).forEach(function (keys) {
        customObj[keys] = search[keys];
      });
      saida.push(customObj);
    }
    this.dataTable = saida[0]; */
console.log(search);
    this.dataTable = search;
    if (this.dataTable.find((x) => x.cpf.length == 11)) {
      this.cnpjCpfMask = CPF;
    } else {
      this.cnpjCpfMask = CNPJ;
    }
    this.dataSource = this.dataTable;
    this.change.markForCheck();
  }

  closeDialog() {
    this.dialog.close({});
  }

  selectedChange(event: any) {
    if (event != undefined) {
      this.Termo = "";
      if (event === 1 || event === 2) {
        this.cnpjCpfMask2 = "";
      }
      if (event === 3) {
        this.cnpjCpfMask2 = CPF;
      }
      if (event === 4) {
        this.cnpjCpfMask2 = TELEFONE;
      }
    }
  }

  fieldMask() {
    if (this.selected === 1 || this.selected === 2) return "";
    else if (this.selected === 3) 
         return this.Termo.length <= 11 ? CPF : CNPJ;
    else if (this.selected === 4)
      return this.Termo.length <= 10 ? TELEFONE : CELULAR;
  }

  modifyMask(event) {
    if (this.Termo.length == 11 && /[0-9]/.test(event.key))
    {
        this.Termo += event.key;
        event.preventDefault();
        event.stopPropagation();
    }
  }

  onCnpjCpfChanged() {
    if (this.Termo.length <= 11 && this.cnpjCpfMask2 === CNPJ) {
      this.cnpjCpfMask2 = CPF;
  } else if (
      this.Termo.length > 11 && //=== 11 &&
      this.cnpjCpfMask2 === CPF &&
      this.previusLength === 11
    ) {
      this.cnpjCpfMask2 = "";
      this.cnpjCpfMask2 = CNPJ;
    }
    this.previusLength = this.Termo.length;
  }
}
