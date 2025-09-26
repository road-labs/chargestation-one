import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { AuthorizationType } from 'lib/settings';

const overrideSessionUid: ChargeStationEventHandler = async (params) => {
  const { session, chargepoint } = params;
  if (session.options.authorizationType !== AuthorizationType.CreditCard) {
    return; // retain current idTag
  }

  const forceAuthorizeId = chargepoint.configuration.getVariableValue(
    'ForceAuthorizeId'
  ) as string;

  session.options.uid = forceAuthorizeId || 'paidByPOS';
  session.options.skipAuthorize = true;
};

export default overrideSessionUid;
