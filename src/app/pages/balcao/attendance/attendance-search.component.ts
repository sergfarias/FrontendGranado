import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
import { AgendamentoService } from "app/services/agendamento.service";
import { AtendimentoService } from "app/services/atendimento.service";
import { LocalStorageService } from "angular-2-local-storage";
import { formatDate } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";
import { AgendamentoGridModel } from "app/models/agendamento/AgendamentoGridModel";
import { AtendimentoModel } from "app/models/atendimento/AtendimentoModel";

const HORA = "00:00";

@Component({
  selector: "attendance-search",
  templateUrl: "./attendance-search.component.html",
  styleUrls: ["./attendance-search.component.scss"],
})
export class AttendanceSearchComponent implements OnInit {

  displayedColumns = [
    "id",
    "dataConsulta",
    "horario",
    "veterinarioId",
    "veterinarioNome",
    "clienteId",
    "clienteNome",
    "animalId",
    "animalNome",
    "tipoAnimalId",
    "tipoAnimalNome" 
    ];
  public dataTable: AgendamentoGridModel[];
  public dataSource: MatTableDataSource<AgendamentoGridModel>;

  @Output() returnsearch = new EventEmitter<any>();

  /* Flag de Controle */
  BuscandoAtendimento: boolean = false;
  GravandoAtendimento: boolean = false;

  @Input() resetValue: any;
  previusLength = 0;

  formCadastroAtendimento: FormGroup;
  private modeloApi: AtendimentoModel = new AtendimentoModel();
  AtendimentoData: AtendimentoModel;
  readonly: boolean;
  checked: boolean;
  AnimalRegisterAwaiter: Subject<any> = new Subject<any>();
  DATE = new FormControl(new Date());
  selectedAnimal: string = "";
  public checkedAgendamentoId: number;

  dataAtendimento: string;
  dataConsulta: string;
  public IsLoading: boolean = false;

  HoraMask = HORA;
  HORA = "";
   
  public constructor(
    private dialog: MatDialogRef<AttendanceSearchComponent>,
    private formBuilder: FormBuilder,
    public agendamentoService: AgendamentoService,
    public atendimentoService: AtendimentoService,
    private mensagem: MensagemService,
    public dialog2: MatDialog,
    public local: LocalStorageService,
    public change: ChangeDetectorRef
    
  ) {
  }

  /* ngAfterViewChecked(){
    //your code to update the model
    this.change.detectChanges();
 } */
 
  /* /////////////////////////////// */
  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]|\//;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  buildForm() {
    /*constrói o formulário reativo*/
    this.formCadastroAtendimento = this.formBuilder.group({
      diagnostico: [null],
      hora: [null],
     });
  }

  ngOnInit() {
    this.buildForm();
  }

  carregarAtendimentos(data){
   console.log(data);

    if (data == null){
      if ((this.dataAtendimento=="") ||(this.dataAtendimento=== undefined) ){
         this.mensagem.enviar("Não foi selecionada uma data, usaremos a data de hoje.", false);
         data =  formatDate(new Date(), 'dd/MM/yyyy', 'pt-BR');      
      }
      else{
        data=this.dataAtendimento;
      }
    }
    
    var dataFormatada = formatDate(data, 'dd/MM/yyyy', 'pt-BR');
    this.dataAtendimento = dataFormatada;
    
    this.IsLoading = true;
    this.atendimentoService.carregarAtendimentos(this.dataAtendimento).subscribe(
      (response) => {
         this.IsLoading = false;
         this.dataTable = response; 
         this.dataSource = new MatTableDataSource<AgendamentoGridModel>(this.dataTable);
         this.change.markForCheck();
      },
      (error: Response) => {
        this.IsLoading = false;
        this.dataTable = []; 
        this.dataSource = new MatTableDataSource<AgendamentoGridModel>(this.dataTable);
      }
    );

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
        this.formCadastroAtendimento.reset(this.resetValue);
    } else {
        this.formCadastroAtendimento.reset();
    }
  }

  radioChangeHandler(row: any, event: any) {
    this.checkedAgendamentoId = parseInt(row.id);
 }

}
