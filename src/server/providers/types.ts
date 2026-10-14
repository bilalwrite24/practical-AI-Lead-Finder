import { ProspectSearchParams, ProspectSearchResult } from '../../types';

export interface ISearchProvider {
  id: string;
  name: string;
  isConfigured(): boolean;
  getMissingConfigHelp(): string;
  search(params: ProspectSearchParams): Promise<ProspectSearchResult[]>;
}
