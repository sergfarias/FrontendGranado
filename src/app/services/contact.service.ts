import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, pipe } from "rxjs";
import { LocalStorageService } from "angular-2-local-storage";
import { UrlRepositoryService } from "./url-repository.service";

import { ContactModel } from "app/models/base/ContactModel";
import { BaseFormService } from "./base-form.service";


interface ApiResult<T>{
  sucesso:boolean;
  mensagem:string;
  Data:T;
}

@Injectable({
  providedIn: "root"
})
export class ContactService extends BaseFormService<ContactModel> {
  
  constructor(
    public http: HttpClient,
    public url: UrlRepositoryService,
    public local: LocalStorageService,
  ){
    super(http, url);
  }

  recuperarDropdownTipoContato(): Observable<any> {   
    return this.http.get(`${this.url.Base.TipoContato}`); 
  }
}
