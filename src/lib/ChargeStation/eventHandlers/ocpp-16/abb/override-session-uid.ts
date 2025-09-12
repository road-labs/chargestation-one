import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { AuthorizationType } from 'lib/settings';

const overrideSessionUid: ChargeStationEventHandler = async (params) => {
  const { session, chargepoint } = params;
  if (session.options.authorizationType !== AuthorizationType.CreditCard) {
    return; // retain current idTag
  }

  session.options.uid = `${chargepoint.settings.abbIdTagPrefix}${Math.floor(Math.random() * 999999)}`;
  session.options.skipAuthorize = true;
};

export default overrideSessionUid;
