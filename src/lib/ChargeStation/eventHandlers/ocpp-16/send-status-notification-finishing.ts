import { sleep } from 'utils/csv';
import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { StatusNotificationRequest } from 'schemas/ocpp/1.6/StatusNotification';

const sendStatusNotificationFinishing: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  sleep(200);
  await chargepoint.writeCall<StatusNotificationRequest>(
    'StatusNotification',
    {
      connectorId: session.connectorId,
      errorCode: 'NoError',
      status: 'Finishing',
      info: 'Finishing',
    },
    session
  );
};

export default sendStatusNotificationFinishing;
