import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, pipe } from "rxjs";
import { map } from "rxjs/operators";
import { LocalStorageService } from "angular-2-local-storage";
import { UrlRepositoryService } from "./url-repository.service";
import { SystemConfigModel } from "app/models/system/SystemConfigModel";
import { AppConfig } from "app/models/AppConfig";

@Injectable({
  providedIn: "root",
})
export class SystemService {
  constructor(
    private http: HttpClient,
    private local: LocalStorageService
  ) {
      // Carregar configurações do sistema
      this.Config = new SystemConfigModel();
      
      //this.Config.ID_FILIAL = 9;

      this.Config.ALIAS_FIDELIZE = "SOU+SAUDE";
      this.Config.CLIENTE_PADRAO = 174448;
  }

  public Config: SystemConfigModel;

  public LocalSettings: AppConfig;

  /**
   * Carrega as configurações locais a partir de um arquivo de configurações externo.
   */
  loadConfig() {
    return this.http
      .get<AppConfig>('./assets/config.json')
      .toPromise()
      .then(config => {
        this.LocalSettings = config;

        this.Config.ID_FILIAL = config.Filial;
      });
  }
  
}
