import { sleep } from '../../../../utils/csv';

import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { ChargeStationSetting, formatMeterReading } from 'lib/settings';

import clock from '../../clock';

const sendStopTransaction: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  chargepoint.sessions[session.connectorId].isStoppingSession = true;
  chargepoint.sessions[session.connectorId].tickInterval?.stop();

  await sleep(1000);

  if (!session.stopTime) {
    throw new Error('stopTime must be set');
  }

  const meterUnit = chargepoint.getSetting(
    ChargeStationSetting.MeterValueUnit
  ) as string;
  const beginMeter = formatMeterReading(0, meterUnit);
  const endMeter = formatMeterReading(session.kwhElapsed, meterUnit);

  chargepoint.writeCall(
    'TransactionEvent',
    {
      eventType: 'Ended',
      timestamp: session.stopTime.toISOString(),
      triggerReason: 'StopAuthorized',
      seqNo: session.seqNo,
      transactionInfo: {
        transactionId: session.transactionId,
        chargingState: 'Charging',
      },
      meterValue: [
        {
          timestamp: session.startTime.toISOString(),
          sampledValue: [
            {
              value: Number(beginMeter.value),
              context: 'Transaction.Begin',
              unitOfMeasure: { unit: beginMeter.unit },
            },
          ],
        },
        {
          timestamp: session.stopTime.toISOString(),
          sampledValue: [
            {
              value: Number(endMeter.value),
              context: 'Transaction.End',
              unitOfMeasure: { unit: endMeter.unit },
            },
          ],
        },
        {
          timestamp: session.stopTime.toISOString(),
          sampledValue: [
            {
              value: session.stateOfCharge,
              context: 'Transaction.End',
              unitOfMeasure: { unit: 'Percent' },
              location: 'EV',
              measurand: 'SoC',
            },
          ],
        },
      ],
      evse: { id: 1, connectorId: session.connectorId },
      idToken: {
        idToken: session.options.uid,
        type: session.options.idTokenType || 'ISO14443',
      },
    },
    session
  );

  await sleep(1000);

  chargepoint.writeCall('StatusNotification', {
    timestamp: clock.now().toISOString(),
    connectorStatus: 'Available',
    evseId: 1,
    connectorId: session.connectorId,
  });
};

export default sendStopTransaction;
