import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlRepositoryService } from "./url-repository.service";
import { LocalStorageService } from "angular-2-local-storage";
import { Observable } from "rxjs";
import { BaseFormService } from "./base-form.service";
import { AgendamentoModel } from "app/models/agendamento/AgendamentoModel";
import { AgendamentoGridModel } from "app/models/agendamento/AgendamentoGridModel";

interface ApiResult<T> {
  sucesso: boolean;
  mensagem: string;
  Data: T;
}

@Injectable({
  providedIn: "root",
})
export class AgendamentoService extends BaseFormService<AgendamentoModel> {
  constructor(
    public http: HttpClient,
    public url: UrlRepositoryService,
    public local: LocalStorageService
  ) {
    super(http, url);
  }

  inserir(model): Observable<any> {
    console.log(1, model);
    return this.http.post(this.url.Agendamentos.CadastroAgendamento, model);
  }

  public carregarAgendamentos(data): Observable<AgendamentoGridModel[]> {
    let url = "";
    url = this.url.Agendamentos.CarregarAgendamentos + "?data=" + data;
    console.log(3);
    return this.http.get<AgendamentoGridModel[]>(url);
  }

}
