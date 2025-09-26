import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { AuthorizationType } from 'lib/settings';

const sendReceipt: ChargeStationEventHandler = async (params) => {
  const { session, chargepoint } = params;
  if (session.options.authorizationType !== AuthorizationType.CreditCard) {
    return; // retain current idTag
  }

  const sendReceipts = chargepoint.configuration.getVariableValue(
    'SendPaymentReceipts'
  ) as string;

  if (sendReceipts === 'None') {
    return;
  }

  chargepoint.writeCall('DataTransfer', {
    vendorId: 'IES',
    messageId: 'PaymentReceipt',
    data: JSON.stringify({
      ConnectorId: session.connectorId,
      PosTransactionId: `POS${session.transactionId}`,
      TimeStamp: new Date().toISOString(),
      ...((sendReceipts === 'Customer' || sendReceipts === 'Both') && {
        CustomerReceipt: 'customerReceipt',
      }),
      ...((sendReceipts === 'Merchant' || sendReceipts === 'Both') && {
        MerchantReceipt: 'merchantReceipt',
      }),
      Offline: false,
      Succeed: true,
      FinalCost: 3000, // TODO: this shouldn't be hardcoded
    }),
  });
};

export default sendReceipt;
