import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlRepositoryService } from "./url-repository.service";
import { LocalStorageService } from "angular-2-local-storage";
import { Observable } from "rxjs";
import { VeterinarioModel } from "app/models/veterinarios/VeterinarioModel";
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
export class VeterinariosService extends BaseFormService<VeterinarioModel> {
  constructor(
    public http: HttpClient,
    public url: UrlRepositoryService,
    public local: LocalStorageService
  ) {
    super(http, url);
  }

  inserir(model): Observable<any> {
    console.log(1, model);
    return this.http.post(this.url.Veterinarios.CadastroVeterinario, model);
  }

  atualizar(model): Observable<any> {
    console.log(2,model);
    return this.http.put(this.url.Veterinarios.AtualizaVeterinario, model);
  }

   /* public PesquisarVeterinarioCampo(Termo, Campo): Observable<VeterinarioModel[]> {
    let url = ""; 
    if ((parseInt(Campo)==2) || (parseInt(Campo)==4)) //nome e telefone
       url = this.url.Veterinarios.PesquisaTermo + "?Termo=" + encodeURIComponent(Termo) + "&Campo=" + encodeURIComponent(Campo); 
   else //id ou CPF
       url = this.url.Veterinarios.PesquisaCodigo + "?Codigo=" + Termo;

   return this.http.get<VeterinarioModel[]>(url);
  } */ 

  listarContato(): Observable<ContactModel[]> {
    return this.http.get<ContactModel[]>(`${this.url}`);
  }

 /*  public Pesquisar(Termo): Observable<VeterinarioModel[]> {
    let url = "";
    url = this.url.Veterinarios.PesquisaCodigo + "?Termo=" + Termo;
    return this.http.get<VeterinarioModel[]>(url);
  }
 */
  public PesquisarVeterinario(Termo): Observable<VeterinarioModel> {
    let url = "";
    url = this.url.Veterinarios.PesquisaVeterinario + "?Termo=" + Termo;
    return this.http.get<VeterinarioModel>(url);
  } 


  public pesquisarVeterinarioNome(Termo): Observable<VeterinarioModel[]> {
    let url = "";
    url = this.url.Veterinarios.PesquisarVeterinarioNome + "?Nome=" + Termo;
    console.log(3);
    return this.http.get<VeterinarioModel[]>(url);
  }
  
  public carregarHorarios(dia, veterinarioId): Observable<VeterinarioModel[]> {
    let url = "";
    url = this.url.Veterinarios.CarregarHorarios + "?dia=" + dia+ "&veterinarioId=" + veterinarioId;
    console.log(3);
    return this.http.get<VeterinarioModel[]>(url);
  }


}
