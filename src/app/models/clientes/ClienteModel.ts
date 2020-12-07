import { ContactModel } from "../base/ContactModel";
import { AnimalModel } from "../base/AnimalModel";

export class ClienteModel {
    public id: number;
    public nome: string;
    public cpf: string;
    public observacao: string;
    public animais: AnimalModel[] = [];
    public contatos: ContactModel[] = [];
    public Termo: string;
    public telefone: ContactModel;
    public celular: ContactModel;
    public email: ContactModel;

    public static IsEmpty(cliente: ClienteModel) {
        return !cliente || !cliente?.cpf || cliente?.cpf == "000.000.000-00";
    }

}