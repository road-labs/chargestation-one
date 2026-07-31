import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { RequestStartTransactionRequest } from 'schemas/ocpp/2.0/RequestStartTransactionRequest';
import { RequestStartTransactionResponse } from 'schemas/ocpp/2.0/RequestStartTransactionResponse';

const handleRequestStartTransaction: ChargeStationEventHandler<
  RequestStartTransactionRequest
> = ({ chargepoint, callMessageId, callMessageBody }) => {
  const { remoteStartId, evseId, idToken } = callMessageBody;

  // RequestStartTransaction addresses an EVSE (not a specific connector); if
  // the EVSE has multiple connectors, the station picks a free one. When
  // evseId is omitted we consider every connector on the station.
  const candidates =
    evseId !== undefined
      ? chargepoint.connectorsForEvse(Number(evseId))
      : chargepoint.connectors;
  const target = candidates.find(
    (c) => !chargepoint.hasRunningSession(c.connectorNumber)
  );

  let response: RequestStartTransactionResponse;

  if (!target) {
    response = {
      status: 'Rejected',
    };
  } else {
    setTimeout(() => {
      chargepoint.startSession(
        target.connectorNumber,
        {
          authorizationType: 'rfid',
          carBatteryKwh: 0,
          carBatteryStateOfCharge: 0,
          maxPowerKw: 0,
          uid: idToken.idToken,
          idTokenType: idToken.type,
          remoteStartId,
          skipAuthorize:
            chargepoint.configuration
              .getVariableValue('AuthCtrlr.AuthorizeRemoteStart')
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

export default handleRequestStartTransaction;
