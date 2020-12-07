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
  selector: "attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"],
})
export class AttendanceComponent implements OnInit {

  displayedColumns = [
    "RADIO",
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
   dataAgendamento: string;
   dataConsulta: string;
   public IsLoading: boolean = false;

   HoraMask = HORA;
  HORA = "";
   
  public constructor(
    private dialog: MatDialogRef<AttendanceComponent>,
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

  onHoraChanged() {
    if (this.HORA.length <= 4) {
      this.HoraMask = HORA;
    } else if (
      this.HORA.length === 4 &&
      this.HoraMask === HORA &&
      this.previusLength === 11
    ) {
    }
    this.previusLength = this.HORA.length;
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

  carregarAgendamentos(data){
   console.log(data);

    if (data == null){
      if ((this.dataAgendamento=="") ||(this.dataAgendamento=== undefined) ){
         this.mensagem.enviar("Não foi selecionada uma data, usaremos a data de hoje.", false);
         data =  formatDate(new Date(), 'dd/MM/yyyy', 'pt-BR');      
      }
      else{
        data=this.dataAgendamento;
      }
    }
    
    var dataFormatada = formatDate(data, 'dd/MM/yyyy', 'pt-BR');
    this.dataAgendamento = dataFormatada;
    console.log("ddd",this.dataAgendamento);
    
    this.IsLoading = true;
    this.agendamentoService.carregarAgendamentos(this.dataAgendamento).subscribe(
      (response) => {
         this.IsLoading = false;
         this.dataTable = response; 
         this.dataSource = new MatTableDataSource<AgendamentoGridModel>(this.dataTable);
         this.change.markForCheck();
      },
      (error: Response) => {
        this.IsLoading = false;
        this.dataTable = []; //saida[0];
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

  public onSubmit(): void {
    this.GravandoAtendimento = true;
      this.inserirOuAtualizar();
  }

  dataAtendimento(data){
     var dataFormatada = formatDate(data, 'dd/MM/yyyy', 'pt-BR');
     this.dataConsulta = dataFormatada;
     console.log("ddd",this.dataConsulta);
   }

   private inserirOuAtualizar(): void {
      var hora = this.HORA; 
      if ((hora=="") ||(hora===null)){
        this.mensagem.enviar("Digite a hora de atendimento.");
        return
      }

      if (hora.length< 4) {
        this.mensagem.enviar("Hora inválida.");
        return
      }

      var hor = parseInt(hora.substring(0,2));
      if (hor>23) {
        this.mensagem.enviar("Hora inválida.");
        return
      }

      var min = parseInt(hora.substring(2,4));
      if (min>59) {
        this.mensagem.enviar("Hora inválida.");
        return
      }

      var hor1: string;
      if (hor.toString().length<2)
         hor1 = "0" + hor; 
      else 
         hor1 =  hor.toString(); 

      var min1: string;
      if (min.toString().length<2)
          min1 = "0" + min; 
      else 
            min1 =  min.toString(); 
   
       hora = hor1 + ":" + min1;
       
      var diagnostico = this.formCadastroAtendimento.value.diagnostico;
      if ((diagnostico=="") ||(diagnostico===null)){
        this.mensagem.enviar("Digite um diagnostico.");
        return
      }    
        
      if ((this.dataConsulta=="") ||(this.dataConsulta=== undefined) ){
           this.mensagem.enviar("Não foi selecionada uma data, usaremos a data de hoje.", false);
           this.dataConsulta =  formatDate(new Date(), 'dd/MM/yyyy', 'pt-BR');      
      }

      var atendimento:  AtendimentoModel;
      atendimento = new AtendimentoModel;
      atendimento.id=0;
      atendimento.diagnostico = diagnostico;
      atendimento.dataAtendimento = this.dataConsulta + " " + hora;

      if ((this.checkedAgendamentoId ===undefined)||(this.checkedAgendamentoId==0)){
        this.mensagem.enviar("Selecione um agendamento.");
        return
       }
       atendimento.agendamentoid = this.checkedAgendamentoId;
  
      this.atendimentoService.inserir(atendimento).subscribe(
        () => {
          this.GravandoAtendimento = false;
          this.mensagem.enviar("Dados inseridos com sucesso.");
        },
        (error) => {
          this.GravandoAtendimento = false;
          this.mensagem.enviar(error.error.errors, false);
          console.log(error);
        }
      );
  }

  radioChangeHandler(row: any, event: any) {
    this.checkedAgendamentoId = parseInt(row.id);
  }

}
