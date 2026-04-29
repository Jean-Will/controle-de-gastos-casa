import { createContext, ReactNode, useContext, useState } from 'react';

type Gasto = {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
};

type GastosContextType = {
  gastos: Gasto[];
  adicionarGasto: (gasto: Omit<Gasto, 'id'>) => void;
};

const GastosContext = createContext<GastosContextType | undefined>(undefined);

export function GastosProvider({ children }: { children: ReactNode }) {
  const [gastos, setGastos] = useState<Gasto[]>([]);

  function adicionarGasto(gasto: Omit<Gasto, 'id'>) {
    const novoGasto: Gasto = {
      id: String(Date.now()),
      ...gasto,
    };

    setGastos((estadoAtual) => [novoGasto, ...estadoAtual]);
  }

  return (
    <GastosContext.Provider value={{ gastos, adicionarGasto }}>
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