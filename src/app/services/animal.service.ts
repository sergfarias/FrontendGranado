import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, pipe } from "rxjs";
import { LocalStorageService } from "angular-2-local-storage";
import { UrlRepositoryService } from "./url-repository.service";
import { AnimalModel } from "app/models/base/AnimalModel";
import { BaseFormService } from "./base-form.service";

interface ApiResult<T>{
  sucesso:boolean;
  mensagem:string;
  Data:T;
}

@Injectable({
  providedIn: "root"
})
export class AnimalService extends BaseFormService<AnimalModel> {
  
  constructor(
    public http: HttpClient,
    public url: UrlRepositoryService,
    public local: LocalStorageService,
  ){
    super(http, url);
  }

  recuperarDropdownTipoAnimal(): Observable<any> {   
    return this.http.get(`${this.url.Base.TipoAnimal}`); 
  }

  public PesquisarAnimal(Termo): Observable<ApiResult<AnimalModel[]>> {
    let url = "";
    return this.http.get<ApiResult<AnimalModel[]>>(url);
  }

  public PesquisarAnimalGrid(Termo): Observable<ApiResult<AnimalModel[]>> {
    let url = "";
    url = this.url.Base.PesquisaAnimalGrid + "?Termo=" + Termo;
    return this.http.get<ApiResult<AnimalModel[]>>(url);
  }

}
