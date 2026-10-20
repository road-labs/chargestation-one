import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { RemoteStartTransactionRequest } from 'schemas/ocpp/1.6/RemoteStartTransaction';
import { RemoteStartTransactionResponse } from 'schemas/ocpp/1.6/RemoteStartTransactionResponse';

const handleRemoteStartTransaction: ChargeStationEventHandler<
  RemoteStartTransactionRequest
> = async ({ chargepoint, callMessageId, callMessageBody }) => {
  const { idTag, connectorId } = callMessageBody;

  let response: RemoteStartTransactionResponse;

  if (chargepoint.hasRunningSession(Number(connectorId))) {
    response = {
      status: 'Rejected',
    };
  } else {
    setTimeout(() => {
      // The zeroes fall back to the session's defaults, and the authorisation type only matters for credit card
      // sessions, which a remote start never is
      chargepoint.startSession(
        Number(connectorId),
        {
          authorizationType: 'rfid',
          carBatteryKwh: 0,
          carBatteryStateOfCharge: 0,
          maxPowerKw: 0,
          uid: idTag,
          skipAuthorize:
            chargepoint.configuration
              .getVariableValue('AuthorizeRemoteTxRequests')
              ?.toString() === 'false',
        },
        'rfid'
      );
    }, 100);
    response = {
      status: 'Accepted',
    };
  }

  chargepoint.writeCallResult(callMessageId, response);
};

export default handleRemoteStartTransaction;
