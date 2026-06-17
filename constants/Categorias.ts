export const CATEGORIAS_PADRAO = [
  'Alimentação',
  'Transporte',
  'Lazer',
  'Energia',
  'Internet',
  'Outros',
] as const;

export type CategoriaPadrao = (typeof CATEGORIAS_PADRAO)[number];

export function isCategoriaPadrao(categoria: string): boolean {
  return (CATEGORIAS_PADRAO as readonly string[]).includes(categoria);
}

export function obterTodasCategorias(personalizadas: string[]): string[] {
  return [...CATEGORIAS_PADRAO, ...personalizadas];
}
