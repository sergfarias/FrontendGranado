import { Injectable } from '@angular/core';
import { SystemService } from './system.service';
import { AppServerModule } from 'app/app.server.module';
import { AppConfig } from 'app/models/AppConfig';

@Injectable({
  providedIn: 'root'
})

export class UrlRepositoryService {
  constructor(private system: SystemService) {}

  private get Settings(): AppConfig {
    return this.system.LocalSettings;
  }
  
  public Clientes = {
    PesquisaTermo: this.Settings.BaseApi + '/pesquisa/termocliente', 
    PesquisaCodigo: this.Settings.BaseApi + '/pesquisa/codigocliente',
    CadastroCliente: this.Settings.BaseApi + '/cadastro/cliente', 
    AtualizaCliente: this.Settings.BaseApi + '/atualiza/cliente', 
    Pesquisa: this.Settings.BaseApi + "/clientes/pesquisa/cliente",
    PesquisaClienteContato: this.Settings.BaseApi + '/pesquisa/clientecontato', 
    TipoCliente: this.Settings.BaseApi + '/pesquisa/tipocliente', 
   PesquisaClienteCPF: this.Settings.BaseApi + '/pesquisa/cliente', 
  };

  public Agendamentos = {
    CadastroAgendamento: this.Settings.BaseApi + '/cadastro/agendamento', 
    CarregarAgendamentos: this.Settings.BaseApi + '/pesquisa/carregaragendamentos',
  };

  public Atendimentos = {
    CadastroAtendimento: this.Settings.BaseApi + '/cadastro/atendimento', 
    CarregarAtendimentos: this.Settings.BaseApi + '/pesquisa/carregaratendimentos',
  };

  public Veterinarios = {
    //PesquisaTermo:  this.Settings.BaseApi + '/pesquisa/termofornecedor', 
    //PesquisaCodigo: this.Settings.BaseApi + '/pesquisa/codigofornecedor', 
    CadastroVeterinario: this.Settings.BaseApi + '/cadastro/veterinario',
    AtualizaVeterinario: this.Settings.BaseApi + '/atualiza/veterinario', 
    PesquisaVeterinario: this.Settings.BaseApi + '/pesquisa/veterinario', 
    PesquisarVeterinarioNome: this.Settings.BaseApi + '/pesquisa/veterinarionome',
    CarregarHorarios: this.Settings.BaseApi + '/pesquisa/carregarhorarios',
  };

  public Base = {
    PesquisaAnimalGrid:this.Settings.BaseApi + '/pesquisa/clienteanimalgrid',
    TipoContato: this.Settings.BaseApi + '/pesquisa/tipocontato',
    TipoAnimal: this.Settings.BaseApi + '/pesquisa/tipoanimal',
  };

  public System = {
    RawPrinter: this.Settings.BaseApi + '/api/rawprinter/print',
  }
 
}
