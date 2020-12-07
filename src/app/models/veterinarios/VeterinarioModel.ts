export class VeterinarioModel {
    public id: number;
    public nome: string;
    public dataContratacao: Date;
    public cpf: string;
    public geriatra: boolean;
    public Termo: string;

    public static IsEmpty(veterinario: VeterinarioModel) {
        return !veterinario || !veterinario?.cpf || veterinario?.cpf == "000.000.000-00";
    }

}