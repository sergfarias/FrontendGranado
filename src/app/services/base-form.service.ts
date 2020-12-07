import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UrlRepositoryService } from "./url-repository.service";

export class BaseFormService<T> {

    protected url:any;

    constructor(
        protected http:HttpClient,
        protected urlRepository: UrlRepositoryService,
    ) {
        this.url = urlRepository.Base;
    }

    inserir(model:T):Observable<any>{
        return this.http.post(this.url, model);
    }

    atualizar(model:T):Observable<any>{
        return this.http.put(this.url, model);
    }

    excluir(id:string){
        return this.http.delete(`${this.url}/${id}`);
    }
}