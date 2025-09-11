import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { AuthorizationType } from 'lib/settings';

export const calculateCostsAndSendDetails: ChargeStationEventHandler = async (
  params
) => {
  const { session, chargepoint } = params;

  if (session.options.authorizationType !== AuthorizationType.CreditCard) {
    return; // session will stop the normal route
  }

  // There is no known configuration around this, so we just apply arbitrary costs
  const costPerMinute = 0.1;
  const costPerkWh = 1;
  const vatRate = 0.21;

  const startTime = session.startTime;
  const stopTime = session.stopTime as Date;
  const durationMinutes =
    (stopTime.getTime() - startTime.getTime()) / 1000 / 60;

  const durationCost = durationMinutes * costPerMinute;
  const kWhCost = session.kwhElapsed * costPerkWh;
  const sessionCost = durationCost + kWhCost;
  const sessionCostInclVat = sessionCost * (1 + vatRate);

  chargepoint.writeCall('DataTransfer', {
    vendorId: 'Autel',
    data: '',
    autel: {
      cmd: 'POS_LOCAL_CDR',
      data: {
        amount: sessionCostInclVat.toFixed(6),
        transactionId: session.transactionId,
        currency: 123,
      },
    },
  });

  chargepoint.writeCall('DataTransfer', {
    vendorId: 'Autel',
    data: '',
    autel: {
      cmd: 'POS_PAY_RESULT',
      seq: 1,
      data: {
        transactionId: session.transactionId,
        posBusId: Math.floor(Math.random() * 999999).toString(),
        payResult: '1',
      },
    },
  });
};
