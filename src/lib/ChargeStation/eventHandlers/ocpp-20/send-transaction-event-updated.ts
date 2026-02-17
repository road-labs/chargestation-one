import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { TransactionEventRequest } from 'schemas/ocpp/2.0/TransactionEventRequest';
import { ChargeStationSetting, formatMeterReading } from 'lib/settings';
import clock from '../../clock';

const sendTransationEventUpdated: ChargeStationEventHandler = ({
  chargepoint,
  session,
}) => {
  const now = clock.now();
  const meterReading = formatMeterReading(
    session.kwhElapsed,
    chargepoint.getSetting(ChargeStationSetting.MeterValueUnit) as string
  );

  chargepoint.writeCall<TransactionEventRequest>('TransactionEvent', {
    eventType: 'Updated',
    timestamp: now.toISOString(),
    triggerReason: 'MeterValuePeriodic',
    seqNo: session.seqNo,
    transactionInfo: {
      transactionId: session.transactionId,
      chargingState: session.suspended ? 'SuspendedEV' : 'Charging',
    },
    meterValue: [
      {
        timestamp: now.toISOString(),
        sampledValue: [
          {
            value: Number(meterReading.value),
            context: 'Sample.Periodic',
            measurand: 'Energy.Active.Import.Register',
            location: 'Outlet',
            unitOfMeasure: { unit: meterReading.unit },
          },
        ],
      },
      {
        timestamp: now.toISOString(),
        sampledValue: [
          {
            value: session.stateOfCharge,
            context: 'Sample.Periodic',
            measurand: 'SoC',
            location: 'EV',
            unitOfMeasure: { unit: 'Percent' },
          },
        ],
      },
    ],
    evse: { id: 1, connectorId: session.connectorId },
  });
};

export default sendTransationEventUpdated;
