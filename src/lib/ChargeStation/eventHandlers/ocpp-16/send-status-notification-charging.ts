import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { StatusNotificationRequest } from 'schemas/ocpp/1.6/StatusNotification';

const sendStatusNotificationCharging: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  await chargepoint.writeCall<StatusNotificationRequest>(
    'StatusNotification',
    {
      connectorId: session.connectorId,
      errorCode: 'NoError',
      status: 'Charging',
      info: 'Charging',
    },
    session
  );
};

export default sendStatusNotificationCharging;
