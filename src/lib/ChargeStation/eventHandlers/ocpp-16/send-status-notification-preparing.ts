import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { StatusNotificationRequest } from 'schemas/ocpp/1.6/StatusNotification';

const sendStatusNotificationPreparing: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  if (chargepoint.currentStatus[session.connectorId] === 'Preparing') {
    return;
  }

  await chargepoint.writeCall<StatusNotificationRequest>(
    'StatusNotification',
    {
      connectorId: session.connectorId,
      errorCode: 'NoError',
      status: 'Preparing',
    },
    session
  );
};

export default sendStatusNotificationPreparing;
