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
import { VeterinariosService } from "app/services/veterinarios.service";
import { VeterinarioModel } from "app/models/veterinarios/VeterinarioModel";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormUtilService } from "app/shared/form-utils.service";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
/* import { MatSelectChange } from "@angular/material/select";
import { PesquisaConvenioModel } from "app/models/convenios/PesquisaConvenioModel";
import { Subject } from "rxjs";
import { DiscountCardComponent } from "../discount-card/discount-card.component";*/
import { ScrollGridColumn } from "app/shared/components/scroll-grid/scroll-grid.component";

const CPF = "000.000.000-00";
const CNPJ = "00.000.000/0000-00";
const TELEFONE = "(00) 0000-0000";
const CELULAR = "(00) 00000-0000";

@Component({
  selector: "app-provider-search",
  templateUrl: "./provider-search.component.html",
  styleUrls: ["./provider-search.component.scss"],
})
export class ProviderSearchComponent implements OnInit {
  cpfMask = CPF;
  previusLength = 0;
  Termo = "";
  selected = null;
  cpfMask2 = CPF;

  array = [
    { name: "Código", key: 1 },
    { name: "Nome", key: 2 },
    { name: "CPF/CNPJ", key: 3 },
    { name: "Telefone", key: 4 },
   // { name: "Carteirinha", key: 5 },
  ];

  @ViewChild("pesquisaInput") pesquisaInput: ElementRef;

  displayedColumns = [
    ScrollGridColumn.setup({MemberName: "id", DisplayName: "Código", Width: 20}),
    ScrollGridColumn.setup({MemberName: "nomeFantasia", DisplayName: "Nome", Width: 50}),
    ScrollGridColumn.setup({MemberName: "cpf", DisplayName: "CPF", Width: 30})
  ];

  private dataTable: VeterinarioModel[];
  private dataSource: VeterinarioModel[] = [];
  private modeloApi: VeterinarioModel = new VeterinarioModel();
  private formSearch: FormGroup;
  IsPesquisando: boolean = false;

  SuprimirConvenios: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public change: ChangeDetectorRef,
    private veterinariosService: VeterinariosService,
    private dialog: MatDialogRef<ProviderSearchComponent>,
    private formBuilder: FormBuilder,
    private formUtil: FormUtilService,
    private mensagem: MensagemService,
    private dialogSvc: MatDialog 
  ) {
    }

  public DadosVeterinario: VeterinarioModel;

  public get modelo(): VeterinarioModel {
    let modelo = Object.assign(
      Object.assign({}, this.modeloApi),
      this.formSearch.value
    ) as VeterinarioModel;

    return modelo;
  }

  public set modelo(modelo: VeterinarioModel) {
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

 /*  Pesquisar(): void {
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

            this.veterinariosService.PesquisarVeterinarioCampo(Termo, selected).subscribe(
              (value) => {
                if (value.length > 0) {
                  this.preencherDados(value); 
                } 
                else { 
                     this.mensagem.enviar("Veterinario informado não existe ou não encontrado.",false);
                }

                this.IsPesquisando = false;
              },
              (error) => {
                this.IsPesquisando = false;
                this.mensagem.enviar(
                  "Veterinario informado não existe ou não encontrado.",
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
 */

  /**
   * Seleciona o cliente e retorna como parâmetro de resultado do modal.
   * @param cliente Cliente selecionado.
   */
  selecionarVeterinario(veterinario) {
    this.DadosVeterinario = veterinario;
    //console.log(this.SuprimirConvenios)
   // if (this.SuprimirConvenios) {
      this.dialog.close(veterinario);
   // } else {
   //   this.selecionarConvenio(cliente);
   // }
  }

  
  /**
   * Após realizar a busca pelo cpf/cnpj, nome e código, os dados do cliente são preenchidos no datatable
   */
  preencherDados(search) {
    console.log(search);
    this.dataTable = search;

    if (this.dataTable.find((x) => x.cpf.length == 11)) {
      this.cpfMask = CPF;
    } else {
      this.cpfMask = CNPJ;
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
        this.cpfMask2 = "";
      }
      if (event === 3) {
        this.cpfMask2 = CPF;
      }
      if (event === 4) {
        this.cpfMask2 = TELEFONE;
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
    if (this.Termo.length <= 11 && this.cpfMask2 === CNPJ) {
      this.cpfMask2 = CPF;
  } else if (
      this.Termo.length > 11 && //=== 11 &&
      this.cpfMask2 === CPF &&
      this.previusLength === 11
    ) {
      this.cpfMask2 = "";
      this.cpfMask2 = CNPJ;
    }
    this.previusLength = this.Termo.length;
  }
}
