import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { MeterValuesRequest } from 'schemas/ocpp/1.6/MeterValues';
import clock from 'lib/ChargeStation/clock';
import {
  ChargeStationSetting,
  formatEnergyMeterReading,
  formatPowerMeterReading,
} from 'lib/settings';

const sendMeterValues: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  const now = clock.now();
  const meterReading = formatEnergyMeterReading(
    session.kwhElapsed,
    chargepoint.getSetting(
      ChargeStationSetting.EnergyActiveImportUnit
    ) as string
  );
  const powerReading = formatPowerMeterReading(
    session.currentPowerKw,
    chargepoint.getSetting(ChargeStationSetting.PowerActiveImportUnit) as string
  );

  chargepoint.writeCall<MeterValuesRequest>('MeterValues', {
    connectorId: session.connectorId,
    transactionId: Number(session.transactionId),
    meterValue: [
      {
        timestamp: now.toISOString(),
        sampledValue: [
          {
            value: meterReading.value,
            context: 'Sample.Periodic',
            measurand: 'Energy.Active.Import.Register',
            location: 'Outlet',
            unit: meterReading.unit,
          },
        ],
      },
      {
        timestamp: now.toISOString(),
        sampledValue: [
          {
            value: powerReading.value,
            context: 'Sample.Periodic',
            measurand: 'Power.Active.Import',
            location: 'Outlet',
            unit: powerReading.unit,
          },
        ],
      },
      {
        timestamp: now.toISOString(),
        sampledValue: [
          {
            value: session.stateOfCharge.toString(),
            context: 'Sample.Periodic',
            measurand: 'SoC',
            location: 'EV',
            unit: 'Percent',
          },
        ],
      },
    ],
  });
};

export default sendMeterValues;
