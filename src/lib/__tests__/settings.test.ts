import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { getSettings } from 'lib/settings';

// utils/env reads window.__ENV__, which does not exist in the node test environment
jest.mock('utils/env', () => ({}));

function setDocumentQuery(search: string) {
  Object.assign(globalThis, { document: { location: { search } } });
}

describe('getSettings', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'document');
  });

  it('converts number settings passed as URL query parameters to numbers', () => {
    setDocumentQuery('?maxPowerKw=11&carBatteryStateOfCharge=50');

    const settings = getSettings();

    expect(settings.maxPowerKw).toBe(11);
    expect(settings.carBatteryStateOfCharge).toBe(50);
  });

  it('converts boolean settings passed as URL query parameters to booleans, so "false" is not truthy', () => {
    setDocumentQuery('?interactiveMessagesReply=false');

    expect(getSettings().interactiveMessagesReply).toBe(false);

    setDocumentQuery('?interactiveMessagesReply=true');

    expect(getSettings().interactiveMessagesReply).toBe(true);
  });

  it('keeps string settings passed as URL query parameters as strings', () => {
    setDocumentQuery('?chargePointSerialNumber=12345');

    expect(getSettings().chargePointSerialNumber).toBe('12345');
  });

  it('uses the default value for settings missing from the URL query', () => {
    setDocumentQuery('');

    expect(getSettings().carBatteryKwh).toBe(64);
  });
});
