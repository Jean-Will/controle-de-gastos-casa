import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CATEGORIAS_PADRAO,
  isCategoriaPadrao,
  obterTodasCategorias,
} from '@/constants/Categorias';

export type Gasto = {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
};

export type Orcamento = {
  categoria: string;
  valorReservado: number;
  valorRestante: number;
};

type GastosContextType = {
  gastos: Gasto[];
  saldoPrincipal: number;
  orcamentos: Orcamento[];
  categoriasPersonalizadas: string[];
  categorias: string[];
  carregando: boolean;
  adicionarGasto: (gasto: Omit<Gasto, 'id'>) => void;
  adicionarAoSaldo: (valor: number) => void;
  definirSaldo: (valor: number) => void;
  criarOrcamento: (categoria: string, valor: number) => boolean;
  excluirOrcamento: (categoria: string) => void;
  adicionarCategoria: (nome: string) => boolean;
  excluirCategoria: (nome: string) => void;
  contarGastosDaCategoria: (categoria: string) => number;
  possuiOrcamento: (categoria: string) => boolean;
};

const STORAGE_KEY = '@controle-gastos-app';

type DadosPersistidos = {
  saldoPrincipal: number;
  orcamentos: Orcamento[];
  gastos: Gasto[];
  categoriasPersonalizadas?: string[];
};

const GastosContext = createContext<GastosContextType | undefined>(undefined);

export function GastosProvider({ children }: { children: ReactNode }) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [saldoPrincipal, setSaldoPrincipal] = useState(0);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  const categorias = useMemo(
    () => obterTodasCategorias(categoriasPersonalizadas),
    [categoriasPersonalizadas]
  );

  useEffect(() => {
    async function carregarDados() {
      try {
        const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);

        if (dadosSalvos) {
          const dados: DadosPersistidos = JSON.parse(dadosSalvos);
          setSaldoPrincipal(dados.saldoPrincipal ?? 0);
          setOrcamentos(dados.orcamentos ?? []);
          setGastos(dados.gastos ?? []);
          setCategoriasPersonalizadas(dados.categoriasPersonalizadas ?? []);
        }
      } catch {
        // Mantém estado inicial em caso de erro na leitura
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  useEffect(() => {
    if (carregando) return;

    async function salvarDados() {
      const dados: DadosPersistidos = {
        saldoPrincipal,
        orcamentos,
        gastos,
        categoriasPersonalizadas,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    }

    salvarDados();
  }, [saldoPrincipal, orcamentos, gastos, categoriasPersonalizadas, carregando]);

  function adicionarGasto(gasto: Omit<Gasto, 'id'>) {
    const novoGasto: Gasto = {
      id: String(Date.now()),
      ...gasto,
    };

    setGastos((estadoAtual) => [novoGasto, ...estadoAtual]);

    setOrcamentos((estadoAtual) => {
      const orcamentoExistente = estadoAtual.find(
        (orcamento) => orcamento.categoria === gasto.categoria
      );

      if (orcamentoExistente) {
        return estadoAtual.map((orcamento) =>
          orcamento.categoria === gasto.categoria
            ? {
                ...orcamento,
                valorRestante: orcamento.valorRestante - gasto.valor,
              }
            : orcamento
        );
      }

      setSaldoPrincipal((saldoAtual) => saldoAtual - gasto.valor);
      return estadoAtual;
    });
  }

  function adicionarAoSaldo(valor: number) {
    setSaldoPrincipal((saldoAtual) => saldoAtual + valor);
  }

  function definirSaldo(valor: number) {
    setSaldoPrincipal(valor);
  }

  function criarOrcamento(categoria: string, valor: number): boolean {
    if (valor <= 0) {
      return false;
    }

    let criado = false;

    setSaldoPrincipal((saldoAtual) => {
      if (valor > saldoAtual) {
        return saldoAtual;
      }

      criado = true;

      setOrcamentos((estadoAtual) => {
        const orcamentoExistente = estadoAtual.find(
          (orcamento) => orcamento.categoria === categoria
        );

        if (orcamentoExistente) {
          return estadoAtual.map((orcamento) =>
            orcamento.categoria === categoria
              ? {
                  ...orcamento,
                  valorReservado: orcamento.valorReservado + valor,
                  valorRestante: orcamento.valorRestante + valor,
                }
              : orcamento
          );
        }

        return [
          ...estadoAtual,
          {
            categoria,
            valorReservado: valor,
            valorRestante: valor,
          },
        ];
      });

      return saldoAtual - valor;
    });

    return criado;
  }

  function excluirOrcamento(categoria: string) {
    setOrcamentos((estadoAtual) => {
      const orcamento = estadoAtual.find((item) => item.categoria === categoria);

      if (!orcamento) {
        return estadoAtual;
      }

      setSaldoPrincipal((saldoAtual) => saldoAtual + orcamento.valorRestante);
      return estadoAtual.filter((item) => item.categoria !== categoria);
    });
  }

  function adicionarCategoria(nome: string): boolean {
    const nomeNormalizado = nome.trim();

    if (!nomeNormalizado) {
      return false;
    }

    const nomeDuplicado =
      CATEGORIAS_PADRAO.some(
        (categoria) => categoria.toLowerCase() === nomeNormalizado.toLowerCase()
      ) ||
      categoriasPersonalizadas.some(
        (categoria) => categoria.toLowerCase() === nomeNormalizado.toLowerCase()
      );

    if (nomeDuplicado) {
      return false;
    }

    setCategoriasPersonalizadas((estadoAtual) => [...estadoAtual, nomeNormalizado]);
    return true;
  }

  function contarGastosDaCategoria(categoria: string): number {
    return gastos.filter((gasto) => gasto.categoria === categoria).length;
  }

  function possuiOrcamento(categoria: string): boolean {
    return orcamentos.some((orcamento) => orcamento.categoria === categoria);
  }

  function excluirCategoria(nome: string) {
    if (isCategoriaPadrao(nome)) {
      return;
    }

    if (possuiOrcamento(nome)) {
      excluirOrcamento(nome);
    }

    setCategoriasPersonalizadas((estadoAtual) =>
      estadoAtual.filter((categoria) => categoria !== nome)
    );
  }

  return (
    <GastosContext.Provider
      value={{
        gastos,
        saldoPrincipal,
        orcamentos,
        categoriasPersonalizadas,
        categorias,
        carregando,
        adicionarGasto,
        adicionarAoSaldo,
        definirSaldo,
        criarOrcamento,
        excluirOrcamento,
        adicionarCategoria,
        excluirCategoria,
        contarGastosDaCategoria,
        possuiOrcamento,
      }}
    >
      {children}
    </GastosContext.Provider>
  );
}

export function useGastos() {
  const context = useContext(GastosContext);

  if (!context) {
    throw new Error('useGastos deve ser usado dentro de GastosProvider');
  }

  return context;
}
