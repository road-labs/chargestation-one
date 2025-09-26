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

  let data: object;
  switch (paymentType) {
    case 0:
    case 1:
      data = {
        Bill: 3000,
        ConnectorId: session.connectorId,
        PaymentType: 'Prepayment',
        OcppTransactionId: Number(session.transactionId),
        PosTransactionId: `POS${session.transactionId}`,
        State: 'Accepted',
        TimeStamp: new Date().toISOString(),
        ErrorDescription: '',
        Rate: '',
        PaymentPlanSelected: '',
        OfflineTransaction: false,
      };
      break;
    case 2:
      data = {
        ConnectorId: session.connectorId,
        PaymentType: 'Preauthorization',
        OcppTransactionId: Number(session.transactionId),
        PosTransactionId: `POS${session.transactionId}`,
        State: 'Accepted',
        TimeStamp: new Date().toISOString(),
        ErrorDescription: '',
        Rate: '',
        PreAuthoAmount: 3000,
        OfflineTransaction: false,
      };
      break;
    default:
      console.error(`Invalid payment type: ${paymentType}`);
      return;
  }

  chargepoint.writeCall('DataTransfer', {
    vendorId: 'IES',
    messageId: 'Payment',
    data: JSON.stringify(data),
  });
};

export default sendPaymentPostStart;
