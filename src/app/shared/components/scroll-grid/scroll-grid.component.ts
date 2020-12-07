import {
  Component,
  Injector,
  Input,
  OnInit,
  Output,
  ElementRef,
  ViewChild,
  HostListener,
  ViewChildren,
  ViewContainerRef,
  EventEmitter,
  Pipe,
  PipeTransform,
} from "@angular/core";
import { Observable } from "rxjs";
import { startWith, map, tap } from "rxjs/operators";

import { FormUtilService } from "../../form-utils.service";
import { BaseInput } from "../../base-input";
import { MatSelect } from "@angular/material/select";
import { MatTableDataSource, MatRow, MatTable } from "@angular/material/table";
import { ScrollbarService } from "app/core/scrollbar/scrollbar.service";

@Component({
  selector: "app-scroll-grid",
  templateUrl: "./scroll-grid.component.html",
  styleUrls: ["./scroll-grid.component.scss"],
})
export class ScrollGridComponent implements OnInit {
  constructor(private scroll: ScrollbarService) {
    this.gridId = this.random(16);
  }

  private gridId: string;

  private random = function (length) {
    let radom13chars = function () {
      return Math.random().toString(16).substring(2, 15);
    };
    let loops = Math.ceil(length / 13);
    return new Array(loops)
      .fill(radom13chars)
      .reduce((string, func) => {
        return string + func();
      }, "")
      .substring(0, length);
  };

  /* Listener global de eventos do teclado */
  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if(!this.focused)
      return;

    if (event.key == "ArrowUp") {
      if (this.selectedRowIndex > 0)
        this.highlight(
          this.dataSource.data[this.selectedRowIndex - 1],
          --this.selectedRowIndex
        );

      event.preventDefault();
      //event.cancelBubble = true;
    } else if (event.key == "ArrowDown") {
      if (this.selectedRowIndex < this.dataSource.data.length - 1)
        this.highlight(
          this.dataSource.data[this.selectedRowIndex + 1],
          ++this.selectedRowIndex
        );

      event.preventDefault();
      //event.cancelBubble = true;
    } else if (event.key == "Enter") {
      //this.SelecionarProduto(this.dataSource.data[this.selectedRowIndex]);
      this.selectItem(this.dataSource.data[this.selectedRowIndex]);

      event.cancelBubble = true;
    }
  }

  public dataSource = new MatTableDataSource<any>([]);
  private rawDataSource: Array<any> = [];
  private selectedRowIndex: number;
  private focusedItem: any;
  private columns: Array<ScrollGridColumn> = [];

  containers;

  @ViewChildren(MatRow, { read: ViewContainerRef }) set itemContainers(content: any) {
    if(content)
      this.containers = content;
  };

  gridElement: ElementRef;

  @ViewChild("grid", { static: false }) private set grid(content: ElementRef) {
    if(content)
      this.gridElement = content;
  }

  @Input("automap") AutoMapColumns: boolean;
  @Input("columns") public set displayedColumns(value: Array<ScrollGridColumn>) {
    this.columns = value;
  }

  public get displayedColumns(): Array<ScrollGridColumn> {
      return this.columns;
  }

  private get displayedColumnsInternal(): Array<ScrollGridColumn> {
      return this.columns?.filter(c => c.Visible);
  }

  private get displayedColumnNames(): Array<string> {
    return this.columns?.filter(c => c.Visible).map(c => c.MemberName);
  }

  @Input("source") public set source(value: Array<any>) {    
    this.rawDataSource = value;

    if (this.rawDataSource.length > 0 && this.AutoMapColumns) {
      this.displayedColumns = Object.keys(this.rawDataSource[0]).map(k => new ScrollGridColumn(k, k, null, null, true));
    }

    this.dataSource = new MatTableDataSource<any>(this.rawDataSource);

    if(this.rawDataSource.length > 0) {
      this.selectedRowIndex = 0;
      this.highlight(this.dataSource.data[0], 0);
    }
  }

  public get source(): Array<any> {
    return this.rawDataSource;
  }

  @Output() public get focusedRow(): any {
    return this.focusedItem;
  }

  @Output() rowSelected = new EventEmitter<any>();
  @Output() rowFocused = new EventEmitter<any>();

  ngOnInit() {}

  highlight(row: any, index: number) {
    this.selectedRowIndex = index;
    this.focusedItem = row;

    setTimeout(() => {
      if(!this.containers?.toArray)
        return;

      if (this.containers.toArray().length > 0) {
        let rowContainer = this.containers.toArray()[index].element
          .nativeElement;
        rowContainer.focus();
      }
    }, 150);

    this.rowFocused.emit(row);

    /* Garantir que o item selecionado não esteja fora do scroll */
    let item = null;

    if(this.containers?.toArray)
        item = this.containers.toArray()[index];

    if (item) {
      let scroll = this.scroll.scrollbars[this.gridId + "-scroller"];

      if(scroll) {
        let scroller = scroll.scrollbar
        let elem = item.element.nativeElement;

        if (!scroller.isVisible(elem)) {
          scroller.scrollIntoView(elem);
        }
      }
    }
  }

  selectItem(item: any) {
    this.rowSelected.emit(item);
  }

  /* Controle de Foco */

  private focused: boolean = false;

  public set isFocused(focus: boolean) {
    if(focus && !this.focused)
      this.focus();
    else if (!focus && this.focused)
      this.blur();
  }

  public get isFocused(): boolean {
    return this.focused;
  }

  grid_onFocus() {
    this.focused = true;
  }

  grid_onBlur() {
    this.focused = false;
  }

  focus() {
    if(this.gridElement) {
      (this.gridElement?.nativeElement as HTMLElement).focus();
      this.focused = true;
    }
  }

  blur() {
    if(this.gridElement) {
      (this.gridElement?.nativeElement as HTMLElement).blur();
      this.focused = false;
    }
  }

}

export class ScrollGridColumn {

    constructor (
        source: string,
        display: string,
        pipe: PipeTransform = null,
        pipeParams: Array<any> = null,
        visible: boolean = true
    ) {
        this.DisplayName = display;
        this.MemberName = source;
        this.Visible = visible;
        this.Pipe = pipe;
        this.PipeParams = pipeParams;
    }

    public DisplayName: string;
    public MemberName: string;
    public Visible: boolean;
    public Pipe: PipeTransform;
    public PipeParams: Array<any>;
    public Width: number;

    public getValue(row) {
      let col = this;

        let val = row[col.MemberName]; 
        
        if(col.Pipe)
          val = col.Pipe.transform(val, this.PipeParams[0]);

        return val;
    }

    public static setup(options: ScrollGridColumnOptions): ScrollGridColumn {
      let col = new ScrollGridColumn(options.MemberName, options.DisplayName);

      col = Object.assign(col, options);

      return col;
    }

}

export class ScrollGridColumnOptions {

  public DisplayName?: string;
  public MemberName?: string;
  public Visible?: boolean;
  public Pipe?: PipeTransform;
  public PipeParams?: Array<any>;
  public Width?: number;

}
