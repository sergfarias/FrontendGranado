import { Injectable } from "@angular/core";
import { LocalStorageService } from "angular-2-local-storage";
import { Moment, Duration } from 'moment';
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
/**
 * Representa um serviço de cache de dados.
 */
export class CacheService {
  constructor(
    private local: LocalStorageService
  ) {
      
  }

  /**
   * Inclui um objeto no cache local.
   * @param key Chave do objeto. Se já existir, será substituído.
   * @param expires Tempo pelo qual o objeto deverá persistir no cache.
   * @param data Dados a serem armazenado em cache.
   */
  public PutCache(key: string, expires: Duration, data: any) {
    let due = moment(new Date()).add(expires).toDate();
    let obj = new CacheObject(due, data);

    this.local.add(key, obj);
  }

  /**
   * Obtém um objeto do cache.
   * @param key Chave do objeto.
   * @param getExpired Indica se a função deverá retornar algum valor mesmo se o objeto já tiver expirado (default: false).
   */
  public GetCache(key: string, getExpired: boolean = false): any {
    let data = this.local.get<CacheObject>(key);

    if(!data || (data.Expired && !getExpired))
        return null;

    return data.Data;
  }
  
}

/**
 * Representa um encapsulador de dados de cache.
 */
class CacheObject {

    constructor(
        due: Date,
        data: any
    ) {
        this.Data = data;
        this.Due = due;
    }

    /**
     * Dados em cache.
     */
    public Data: any;

    /**
     * Data de expiração da informação.
     */
    public Due: Date;

    /**
     * Indica se o objeto expirou.
     */
    public get Expired(): boolean {
        return new Date() > this.Due;
    } 

}