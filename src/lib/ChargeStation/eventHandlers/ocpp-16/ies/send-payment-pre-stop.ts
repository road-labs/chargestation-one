import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { AuthorizationType } from 'lib/settings';

const sendPaymentPostStart: ChargeStationEventHandler = async (params) => {
  const { session, chargepoint } = params;
  if (session.options.authorizationType !== AuthorizationType.CreditCard) {
    return; // retain current idTag
  }

  const paymentType = Number(
    chargepoint.configuration.getVariableValue('PaymentType')
  );

  if (paymentType !== 2) {
    return;
  }

  // There might be configuration to take into account here, but just hardcoding for now.
  const costPerMinute = 10;
  const costPerkWh = 100;
  const vatRate = 0.21;

  const startTime = session.startTime;
  const stopTime = session.stopTime as Date;
  const durationMinutes =
    (stopTime.getTime() - startTime.getTime()) / 1000 / 60;

  const durationCostIncVat = Math.ceil(
    durationMinutes * costPerMinute * (1 + vatRate)
  );
  const kWhCostIncVat = Math.ceil(
    session.kwhElapsed * costPerkWh * (1 + vatRate)
  );
  const startCostIncVat = 100;

  chargepoint.writeCall('DataTransfer', {
    vendorId: 'IES',
    messageId: 'Payment',
    data: JSON.stringify({
      Bill: startCostIncVat + durationCostIncVat + kWhCostIncVat,
      ChargeBill: kWhCostIncVat,
      AccessBill: startCostIncVat,
      ParkingBill: durationCostIncVat,
      Currency: 'Euro',
      ConnectorId: 1,
      PaymentType: 'Preauthorization',
      PosTransactionId: `POS${session.transactionId}`,
      State: 'Ended',
      TimeStamp: new Date().toISOString(),
    }),
  });
};

export default sendPaymentPostStart;
