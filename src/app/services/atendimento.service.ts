import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlRepositoryService } from "./url-repository.service";
import { LocalStorageService } from "angular-2-local-storage";
import { Observable } from "rxjs";
import { BaseFormService } from "./base-form.service";
import { AgendamentoGridModel } from "app/models/agendamento/AgendamentoGridModel";
import { AtendimentoModel } from "app/models/atendimento/AtendimentoModel";
import { AtendimentoGridModel } from "app/models/atendimento/AtendimentoGridModel";

interface ApiResult<T> {
  sucesso: boolean;
  mensagem: string;
  Data: T;
}

@Injectable({
  providedIn: "root",
})
export class AtendimentoService extends BaseFormService<AtendimentoModel> {
  constructor(
    public http: HttpClient,
    public url: UrlRepositoryService,
    public local: LocalStorageService
  ) {
    super(http, url);
  }

  inserir(model): Observable<any> {
    return this.http.post(this.url.Atendimentos.CadastroAtendimento, model);
  }

  public carregarAgendamentos(data): Observable<AgendamentoGridModel[]> {
    let url = "";
    url = this.url.Agendamentos.CarregarAgendamentos + "?data=" + data;
    return this.http.get<AgendamentoGridModel[]>(url);
  }

  public carregarAtendimentos(data): Observable<AtendimentoGridModel[]> {
    let url = "";
    url = this.url.Atendimentos.CarregarAtendimentos + "?data=" + data;
    return this.http.get<AtendimentoGridModel[]>(url);
  }
  
}
