import { sleep } from '../../../../utils/csv';
import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { StatusNotificationRequest } from 'schemas/ocpp/1.6/StatusNotification';

const sendStatusNotificationAvailable: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  await sleep(1000);

  if (session?.connectorId) {
    await chargepoint.writeCall<StatusNotificationRequest>(
      'StatusNotification',
      {
        connectorId: session.connectorId,
        errorCode: 'NoError',
        status: 'Available',
      }
    );
    return;
  }

  const numConnectors = Number(
    chargepoint.configuration.getVariableValue('NumberOfConnectors')
  );
  for (let i = 0; i < numConnectors; i++) {
    await chargepoint.writeCall<StatusNotificationRequest>(
      'StatusNotification',
      {
        connectorId: i + 1,
        errorCode: 'NoError',
        status: 'Available',
      },
      session
    );
  }
};

export default sendStatusNotificationAvailable;
