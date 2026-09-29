import {
  DEFAULT_CURRENCY,
  DEFAULT_USER_CURRENCY
} from '@ghostfolio/common/config';

import { ExchangeRateDataService } from './exchange-rate-data.service';

describe('ExchangeRateDataService', () => {
  function createService() {
    const dataProviderService = {
      getDataSourceForExchangeRates: jest.fn().mockReturnValue('YAHOO'),
      getHistorical: jest.fn().mockResolvedValue({}),
      getQuotes: jest.fn().mockResolvedValue({})
    };
    const marketDataService = { getRange: jest.fn().mockResolvedValue([]) };
    const prismaService = {
      account: { findMany: jest.fn().mockResolvedValue([]) },
      symbolProfile: { findMany: jest.fn().mockResolvedValue([]) }
    };
    const propertyService = { getByKey: jest.fn().mockResolvedValue([]) };

    return new ExchangeRateDataService(
      dataProviderService as never,
      marketDataService as never,
      prismaService as never,
      propertyService as never
    );
  }

  it('offers Vietnamese dong (VND) even when no account or asset uses it yet', async () => {
    const service = createService();

    await service.initialize();

    expect(service.getCurrencies()).toContain('VND');
  });

  it('keeps USD as the internal pivot currency for exchange rates', () => {
    expect(DEFAULT_CURRENCY).toBe('USD');
  });

  it('uses VND as the default currency of new users', () => {
    expect(DEFAULT_USER_CURRENCY).toBe('VND');
  });
});
