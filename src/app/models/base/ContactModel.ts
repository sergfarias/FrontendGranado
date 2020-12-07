import { HttpParams } from "@angular/common/http";

export class ContactModel {
    public ID_CONTATO: number;
    public ID_TIPO_CONTATO: number;
    public DS_TIPO_CONTATO: string;
    public DS_CONTATO: string;
    contatos: ContactModel[] = [];

    static deserialize(obj:any) {
        const model = new ContactModel();
        model.contatos = obj.contatos;

        return model;
    }
}