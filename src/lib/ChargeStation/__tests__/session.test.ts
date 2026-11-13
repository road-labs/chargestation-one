import { describe, expect, it, jest } from '@jest/globals';
import ChargeStation, { Session, Settings } from 'lib/ChargeStation';
import { ChargeStationEventEmitter } from 'lib/ChargeStation/eventHandlers';

// utils/env reads window.__ENV__, which does not exist in the node test environment
jest.mock('utils/env', () => ({}));
// the OCMF packages ship as ES modules, which Jest does not transform; signing is not under test here
jest.mock('@road-labs/ocmf-crypto-noble', () => ({ Crypto: class {} }));
jest.mock('@road-labs/ocmf', () => ({ Signer: class {} }));

// the simulation clock starts an interval on import; Jest 28 cannot fake performance on Node 22, where it is read-only
jest.useFakeTimers({ doNotFake: ['performance'] });

function createChargeStationStub(settings: Partial<Settings>): ChargeStation {
  return {
    settings,
    currentStatus: {},
    getMeterValueSampleInterval: () => 60,
  } as unknown as ChargeStation;
}

const emitterStub = {
  emitEvent: jest.fn(),
} as unknown as ChargeStationEventEmitter;

describe('Session', () => {
  it('uses the power and battery values from the station settings when the session options leave them out, as remote starts do', () => {
    const chargeStation = createChargeStationStub({
      maxPowerKw: 11,
      carBatteryKwh: 40,
      carBatteryStateOfCharge: 30,
    });

    const session = new Session(
      1,
      { uid: 'FF88888801', authorizationType: 'rfid' },
      emitterStub,
      chargeStation
    );

    expect(session.currentPowerKw).toBe(11);
    expect(session.stateOfCharge).toBe(30);
  });

  it('prefers the values in the session options over the station settings, as a Start Session override does', () => {
    const chargeStation = createChargeStationStub({
      maxPowerKw: 11,
      carBatteryKwh: 40,
      carBatteryStateOfCharge: 30,
    });

    const session = new Session(
      1,
      {
        uid: 'FF88888801',
        authorizationType: 'rfid',
        maxPowerKw: 50,
        carBatteryKwh: 80,
        carBatteryStateOfCharge: 10,
      },
      emitterStub,
      chargeStation
    );

    expect(session.currentPowerKw).toBe(50);
    expect(session.stateOfCharge).toBe(10);
  });

  it('adds charge to the state of charge in proportion to the max power and battery capacity', async () => {
    const chargeStation = createChargeStationStub({
      maxPowerKw: 36,
      carBatteryKwh: 100,
      carBatteryStateOfCharge: 50,
    });

    const session = new Session(
      1,
      { uid: 'FF88888801', authorizationType: 'rfid' },
      emitterStub,
      chargeStation
    );

    // 36 kW for 100 seconds is 1 kWh, which is 1% of a 100 kWh battery
    const ticking = session.tick(100);
    jest.advanceTimersByTime(100);
    await ticking;

    expect(session.stateOfCharge).toBeCloseTo(51);
  });
});
