import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { UnlockConnectorResponse } from 'schemas/ocpp/2.0/UnlockConnectorResponse';
import { UnlockConnectorRequest } from 'schemas/ocpp/2.0/UnlockConnectorRequest';

const handleUnlockConnector: ChargeStationEventHandler<
  UnlockConnectorRequest
> = async ({ chargepoint, callMessageBody, callMessageId }) => {
  const { evseId, connectorId } = callMessageBody;
  const connector = chargepoint.getConnectorByEvse(evseId, connectorId);

  if (!connector) {
    const result: UnlockConnectorResponse = {
      status: 'UnknownConnector',
    };
    chargepoint.writeCallResult(callMessageId, result);
    return;
  }

  const response: UnlockConnectorResponse = {
    status: 'UnlockFailed',
  };

  if (chargepoint.hasRunningSession(connector.connectorNumber)) {
    await chargepoint.stopSession(connector.connectorNumber);
    response.status = 'Unlocked';
  }

  chargepoint.writeCallResult(callMessageId, response);
};

export default handleUnlockConnector;
