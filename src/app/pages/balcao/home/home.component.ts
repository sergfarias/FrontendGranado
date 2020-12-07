import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ROUTE_TRANSITION } from "../../../app.animation";
import { ClientRegisterComponent } from "../client-register/client-register.component";
import { ClientesService } from "app/services/clientes.service";
import { LocalStorageService } from "angular-2-local-storage";
import { MensagemService } from "app/shared/mensagem/mensagem.service";
import { LocalSystemService } from "app/services/localsystem.service";
import { ProviderRegisterComponent } from "../provider-register/provider-register.component";
import { FormControl } from "@angular/forms";
import { VeterinariosService } from "app/services/veterinarios.service";
import { MatTableDataSource } from "@angular/material/table";
import { formatDate } from "@angular/common";
import { HorarioModel } from "app/models/veterinarios/HorarioModel";
import { ScheduleRegisterComponent } from "../schedule/schedule-register.component";
import { AttendanceComponent } from "../attendance/attendance.component";

@Component({
  selector: "home",
  templateUrl: "./home.html",
  styleUrls: ["./home.component.scss"],
  animations: [...ROUTE_TRANSITION],
  host: { "[@routeTransition]": "" },
})
export class StoreFrontBudgetComponent implements OnDestroy, OnInit {
  myControl = new FormControl();
  lista: any[];
  previusLength = 0;
  Username: string = "";
  Password: string = "";
  public IsLoading: boolean = false;
  veterinarioId: number =0;
  clickCount: number=0;

  displayedColumns = [
    "id",
    "veterinarioid",
    "veterinarionome",
    "horario", 
    "geriatra",
  ];
  public dataTable: any[];
  public dataSource: MatTableDataSource<any>;

dataContratacao: string;

  DATE = new FormControl(new Date());

  constructor(
    public dialog: MatDialog,
    public clientes: ClientesService,
    public veterinarios: VeterinariosService,
    public change: ChangeDetectorRef,
    public local: LocalStorageService,
    private sys: LocalSystemService,
    private mensagem: MensagemService,
  ) {
  }

  /*  Flag de controle de modal */
  ModalOpen: boolean = false;

  setFocus(element) {
    if (!element || !element.nativeElement) return;
    element.nativeElement.select();
    element.nativeElement.focus();
  }

  /*  Diálogos */
  /* /////////////////////////////// */
  dialogClientRegister() {
    const dialogRef = this.dialog.open(ClientRegisterComponent, {
      id: "client-register",
    });
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe((r) => (this.ModalOpen = false));
  }

  dialogProviderRegister() {
    const dialogRef = this.dialog.open(ProviderRegisterComponent, {
      id: "provider-register",
    });
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe((r) => (this.ModalOpen = false));
  }

  dialogHorarioRegister(horario:any) {
    console.log(horario);
    const dialogRef = this.dialog.open(ScheduleRegisterComponent, {
      id: "schedule-register",
      data: {
        Horario: horario,
        DataContratacao: this.dataContratacao
      }//,
      //width: "640px",
      //height: "480px",
    });
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe((r) => (this.ModalOpen = false));
  }

  dialogAttendanceRegister() {
    const dialogRef = this.dialog.open(AttendanceComponent, {
      id: "attendance-register",
    });
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe((r) => (this.ModalOpen = false));
  }


  /*  Implementações do componente */

  ngOnInit() {
    
  }

  ngOnDestroy() {
  }

  /* /////////////////////////////// */

  
  /* Listener global de eventos do teclado */
  //@HostListener("window:keyup", ["$event"])
  @HostListener("window:keydown", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if (this.ModalOpen) return;

    if (event.ctrlKey && event.which == 13) {
    } else if (event.altKey && event.key === "F2") {
    } else if (event.altKey && event.key === "F3") {
    } else if (event.altKey && event.key === "F5") {
      //CLIENTE
      this.dialogClientRegister();
    }
  }

  keyPress(event: KeyboardEvent) {
    if (event.key == "ArrowDown" || event.key == "ArrowUp")
      //setas
      return;

    const pattern = /[0-9]|\//;
    const inputChar = event.key; //String.fromCharCode(event.charCode); ---> para Keypress
    if (!pattern.test(inputChar)) {
      //havia criado um contado para pesquisar a cada tres letras digitas.
      this.previusLength = this.previusLength + 1;
      if (this.previusLength == 3) {
        this.previusLength = 0;
        this.pesquisarVeterinario();
      }
    } else this.lista = [];
  }


  carregarHorarios(dia, veterinarioId){
   
    if (dia == null){
      if ((this.dataContratacao=="") ||(this.dataContratacao=== undefined) ){
         this.mensagem.enviar("Não foi selecionada uma data, usaremos a data de hoje.", false);
         dia =  formatDate(new Date(), 'dd/MM/yyyy', 'pt-BR');      
      }
      else{
        dia=this.dataContratacao;
      }
    }
    
    if (veterinarioId==0){
      this.Username = "";
    }

    var data = formatDate(dia, 'dd/MM/yyyy', 'pt-BR');
    this.dataContratacao = data;
    console.log("ddd",this.dataContratacao);
    
    this.IsLoading = true;
    this.veterinarios.carregarHorarios(data, veterinarioId).subscribe(
      (response) => {
         this.IsLoading = false;
         this.dataTable = response; 
         this.dataSource = new MatTableDataSource<HorarioModel>(this.dataTable);
         this.change.markForCheck();
      },
      (error: Response) => {
        this.IsLoading = false;
        this.dataTable = []; //saida[0];
        this.dataSource = new MatTableDataSource<HorarioModel>(this.dataTable);
      }
    );

  }

  SelecionarHorario(horario: any) {
    console.log(9);
    this.clickCount++;
    var evento: any = event;
    setTimeout(() => {
        if (this.clickCount === 1) {
             console.log(evento);
             // single
             if (evento!=undefined){
               if (evento.key === "Enter") {
                   this.dialogHorarioRegister(horario);
               }
            }
        } else if (this.clickCount === 2) {
            // double
            this.dialogHorarioRegister(horario);
        }
        this.clickCount = 0;
    }, 250)
  }

  pesquisarVeterinario() {
    if (this.Username === "") {
      this.lista = [];
      return;
    }
    this.IsLoading = true;
    this.veterinarios.pesquisarVeterinarioNome(this.Username).subscribe(
      (response) => {
        this.IsLoading = false;
        this.lista = response;
      },
      (error: Response) => {
        this.IsLoading = false;
      }
    );

  }




  /**
   * Limpa o estado de armazenamento de orçamento no LocalStorage do navegador.
   */
  public LimparCache() {
    this.local.set("d1000.Orcamento", null);
  }

}
