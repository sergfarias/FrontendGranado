import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, pipe } from "rxjs";
import { map } from "rxjs/operators";
import { LocalStorageService } from "angular-2-local-storage";
import { UrlRepositoryService } from "./url-repository.service";
import { SystemConfigModel } from "app/models/system/SystemConfigModel";
import { AppConfig } from "app/models/AppConfig";
import { PrintRawRequestDTO } from "app/models/system/PrintRawRequestDTO";

@Injectable({
  providedIn: "root",
})
export class LocalSystemService {
  constructor(
    private http: HttpClient,
    private url: UrlRepositoryService
  ) {

  }

  public PrintRaw(Content: string, Printer: string): Observable<string> {
    let url = this.url.System.RawPrinter;
    let data = new PrintRawRequestDTO();

    data.PrinterName = Printer;
    data.Content = Content;    

    return this.http.post<any>(url, data);
  }
  
}
