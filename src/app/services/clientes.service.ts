import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlRepositoryService } from "./url-repository.service";
import { LocalStorageService } from "angular-2-local-storage";
import { Observable } from "rxjs";
import { ClienteModel } from "app/models/clientes/ClienteModel";
import { BaseFormService } from "./base-form.service";
import { ContactModel } from "app/models/base/ContactModel";

interface ApiResult<T> {
  sucesso: boolean;
  mensagem: string;
  Data: T;
}

@Injectable({
  providedIn: "root",
})
export class ClientesService extends BaseFormService<ClienteModel> {
  constructor(
    public http: HttpClient,
    public url: UrlRepositoryService,
    public local: LocalStorageService
  ) {
    super(http, url);
  }

  inserir(model): Observable<any> {
    return this.http.post(this.url.Clientes.CadastroCliente, model);
  }

  atualizar(model): Observable<any> {
    return this.http.put(this.url.Clientes.AtualizaCliente, model);
  }

  public PesquisarCliente(Termo): Observable<ClienteModel[]> {
    let url = "";

    if (isNaN(parseInt(Termo)))
      url =
        this.url.Clientes.PesquisaTermo + "?Termo=" + encodeURIComponent(Termo);
    else url = this.url.Clientes.PesquisaCodigo + "?Codigo=" + Termo;

    return this.http.get<ClienteModel[]>(url);
  }

   public PesquisarClienteCampo(Termo, Campo): Observable<ClienteModel[]> {
    let url = ""; 
    if ((parseInt(Campo)==2) || (parseInt(Campo)==4)) //nome e telefone
       url = this.url.Clientes.PesquisaTermo + "?Termo=" + encodeURIComponent(Termo) + "&Campo=" + encodeURIComponent(Campo); 
   else //id ou CPF
       url = this.url.Clientes.PesquisaCodigo + "?Codigo=" + Termo;

   return this.http.get<ClienteModel[]>(url);
  } 

  listarContato(): Observable<ContactModel[]> {
    return this.http.get<ContactModel[]>(`${this.url}`);
  }

  public Pesquisar(Termo): Observable<ApiResult<ClienteModel[]>> {
    let url = "";
    url = this.url.Clientes.Pesquisa + "?Termo=" + Termo;

    return this.http.get<ApiResult<ClienteModel[]>>(url);
  }

  public PesquisarClienteCPF(Termo): Observable<ClienteModel> {
    let url = "";
    url = this.url.Clientes.PesquisaClienteCPF + "?Termo=" + Termo;
    return this.http.get<ClienteModel>(url);
  }

  public PesquisarClienteContato(Termo): Observable<ApiResult<ContactModel>> {
    let url = "";
    url = this.url.Clientes.PesquisaClienteContato + "?Termo=" + Termo;
    return this.http.get<ApiResult<ContactModel>>(url);
  }

  recuperarDropdownTipoCliente(): Observable<any> {   
    return this.http.get(`${this.url.Clientes.TipoCliente}`); 
  }


}
