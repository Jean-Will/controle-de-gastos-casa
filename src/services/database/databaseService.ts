export type StatusConexao = 'desconectado' | 'conectando' | 'conectado' | 'erro';

export type DadosSincronizaveis = {
  saldoPrincipal: number;
  orcamentos: unknown[];
  gastos: unknown[];
  categoriasPersonalizadas: string[];
};

export interface DatabaseService {
  conectar(): Promise<boolean>;
  sincronizarDados(dados: DadosSincronizaveis): Promise<boolean>;
  salvarDados(dados: DadosSincronizaveis): Promise<boolean>;
  carregarDados(): Promise<DadosSincronizaveis | null>;
  obterStatus(): StatusConexao;
}

class MockDatabaseService implements DatabaseService {
  private status: StatusConexao = 'desconectado';

  async conectar(): Promise<boolean> {
    this.status = 'conectando';

    // Placeholder para futura integração (Supabase, Firebase, Appwrite, etc.)
    await new Promise((resolve) => setTimeout(resolve, 300));

    this.status = 'desconectado';
    return false;
  }

  async sincronizarDados(_dados: DadosSincronizaveis): Promise<boolean> {
    // Placeholder: sincronização bidirecional com banco online
    return false;
  }

  async salvarDados(_dados: DadosSincronizaveis): Promise<boolean> {
    // Placeholder: persistência remota
    return false;
  }

  async carregarDados(): Promise<DadosSincronizaveis | null> {
    // Placeholder: leitura remota
    return null;
  }

  obterStatus(): StatusConexao {
    return this.status;
  }
}

export const databaseService: DatabaseService = new MockDatabaseService();
