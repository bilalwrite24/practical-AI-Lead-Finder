import { GoogleGroundingProvider } from './GoogleGroundingProvider';
import { ISearchProvider } from './types';

class SearchProviderRegistry {
  private providers: Map<string, ISearchProvider> = new Map();

  constructor() {
    const google = new GoogleGroundingProvider();
    this.providers.set(google.id, google);
  }

  registerProvider(provider: ISearchProvider) {
    this.providers.set(provider.id, provider);
  }

  getProvider(id?: string): ISearchProvider {
    if (id && this.providers.has(id)) {
      return this.providers.get(id)!;
    }
    // Default to Google Grounding
    return this.providers.get('google-grounding')!;
  }

  listProviders() {
    return Array.from(this.providers.values()).map(p => ({
      id: p.id,
      name: p.name,
      isConfigured: p.isConfigured(),
    }));
  }
}

export const providerRegistry = new SearchProviderRegistry();
