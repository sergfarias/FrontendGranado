import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AnimalModel } from "app/models/base/AnimalModel";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AnimalService } from "app/services/animal.service";
import { FormUtilService } from "app/shared/form-utils.service";
import { MensagemService } from "app/shared/mensagem/mensagem.service";

@Component({
  selector: "app-animal-register",
  templateUrl: "./animal-register.component.html",
  styleUrls: ["./animal-register.component.scss"],
})
export class AnimalRegisterComponent implements OnInit {
  formCadastroAnimal: FormGroup;
  private modeloApi: AnimalModel = new AnimalModel();

  listTipoAnimal: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialogRef<AnimalRegisterComponent>,
    private formBuilder: FormBuilder,
    private animalService: AnimalService,
    private formUtil: FormUtilService,
    private mensagem: MensagemService,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    if (this.data[0]) {
      this.modelo = this.data[0];
    }

    this.preencherDados(this.modelo);
    this.recuperarDropdownTipoAnimal();
  }

  private get modelo(): AnimalModel {
    return Object.assign(this.modeloApi, this.formCadastroAnimal.value) as AnimalModel;
  }

  private set modelo(modelo: AnimalModel) {
    console.log("modelo>>", modelo);
    this.modeloApi = modelo;

    this.formCadastroAnimal.patchValue({
      clienteId: modelo.clienteId,
      id: modelo.id,
      nome: modelo.nome,
      idade: modelo.idade,
      tipoAnimalId: modelo.tipoAnimalId,
      RADIO: modelo.RADIO,
    });
  }

  buildForm() {
    /*constrói o formulário reativo*/
    this.formCadastroAnimal = this.formBuilder.group({
      clienteId: [0],
      id: [0],
      nome: [""],
      idade: [0],
      tipoAnimalId: [0],
    });
  }

  preencherDados(search: AnimalModel) {
    console.log("preencher animal");
    if (search!=null){
      if (search.nome==undefined){
        this.formCadastroAnimal.get("nome").patchValue(search);
      }
      else
      {
        this.formCadastroAnimal.get("clienteId").patchValue(search.clienteId);
        this.formCadastroAnimal.get("id").patchValue(search.id);
        this.formCadastroAnimal.get("nome").patchValue(search.nome);
        this.formCadastroAnimal.get("idade").patchValue(search.idade);
        this.formCadastroAnimal.get("tipoAnimalId").patchValue(search.tipoAnimalId);
      }  
  }
  }

  TipoAnimal(tipoAnimalId){
     if (tipoAnimalId==1) return "Cão";
     if (tipoAnimalId==2) return "Gato";
     if (tipoAnimalId==3) return "Hamster";
  }

  public onSubmit(): void {
    console.log(222);
    if (this.modelo.nome==""){
      this.mensagem.enviar("Digite um nome.",false);
      return;
    }
    if (this.modelo.idade==0){
      this.mensagem.enviar("Selecione a idade do animal.",false);
      return;
    }
    if (this.modelo.tipoAnimalId==0){
      this.mensagem.enviar("Selecione tipo de animal.",false);
      return;
    }

    this.modelo.tipoAnimalNome= this.TipoAnimal(this.modelo.tipoAnimalId);
    this.formUtil.verificaValidacoes(this.formCadastroAnimal);
    this.closeDialog(this.modelo);
  }

  closeDialog(model) {
    this.dialog.close(model);
  }

  recuperarDropdownTipoAnimal() {
    console.log("t");
    this.animalService.recuperarDropdownTipoAnimal().subscribe((values) => {
      this.listTipoAnimal = values;
    });
  }

}
