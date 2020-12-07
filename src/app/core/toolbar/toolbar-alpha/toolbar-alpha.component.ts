import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ROUTE_TRANSITION } from '../../../app.animation';
import escape from 'lodash-es/escape';
import { ClientRegisterComponent } from '../../../pages/balcao/client-register/client-register.component';
import { SystemService } from 'app/services/system.service';
import { AttendanceSearchComponent } from 'app/pages/balcao/attendance/attendance-search.component';

@Component({
  selector: 'elastic-toolbar-alpha',
  templateUrl: './toolbar-alpha.component.html',
  styleUrls: ['./toolbar-alpha.component.scss']
})
export class ToolbarAlphaComponent implements OnInit {

  @Input() sidenavCollapsed: boolean;
  @Input() quickpanelOpen: boolean;
  @Output() toggledSidenav = new EventEmitter();
  @Output() toggledQuickpanel = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    public system: SystemService
  ) { }

  /* Dropdown */
  isOpen: boolean;

  /* Dialogs */
  ModalOpen: boolean = false;

  public get ID_FILIAL(): number {
    return this.system.Config.ID_FILIAL;
  }

  ngOnInit() {
    this.isOpen = false;
  }

  /* /////////////////////////////// */

  dialogClientRegister() {
    const dialogRef = this.dialog.open(ClientRegisterComponent, {
      id: 'client-register'
    });
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe(r => this.ModalOpen = false);
  }

  dialogAttendanceSearchRegister() {
    const dialogRef = this.dialog.open(AttendanceSearchComponent, {
      id: "attendance-search",
    });
    this.ModalOpen = true;
    dialogRef.afterClosed().subscribe((r) => (this.ModalOpen = false));
  }


  budgetSave() {
    //this.telaOrcamento.SalvarOrcamento();
  }

  budgetClear() {
    //this.telaOrcamento.LimparOrcamento();
  }

  budgetGravar() {
    //this.telaOrcamento.GravarOrcamento();
  }
  /* /////////////////////////////// */

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }

  toggleSidenav() {
    this.toggledSidenav.emit();
  }

  toggleQuickpanel() {
    this.toggledQuickpanel.emit();
  }

  limitDescount() {
    //this.telaOrcamento.LimiteDesconto();
  }

}
