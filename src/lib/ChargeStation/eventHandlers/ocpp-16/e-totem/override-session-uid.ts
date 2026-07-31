import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { AuthorizationType } from 'lib/settings';

const overrideSessionUid: ChargeStationEventHandler = async (params) => {
  const { session, chargepoint } = params;
  if (session.options.authorizationType !== AuthorizationType.CreditCard) {
    return; // retain current idTag
  }

  const paddedSerialNumber =
    chargepoint.settings.chargePointSerialNumber.padStart(14, '0');
  const paddedConnectorNumber = session.connectorNumber
    .toString()
    .padStart(2, '0');
  session.options.uid = `FF${paddedSerialNumber}${paddedConnectorNumber}`;
};

export default overrideSessionUid;
