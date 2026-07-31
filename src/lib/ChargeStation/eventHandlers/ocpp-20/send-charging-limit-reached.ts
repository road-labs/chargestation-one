import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { StatusNotificationRequest } from 'schemas/ocpp/2.0/StatusNotificationRequest';

import clock from '../../clock';

const sendChargingLimitReached: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  chargepoint.writeCall<StatusNotificationRequest>('StatusNotification', {
    connectorId: session.connector.connectorId,
    evseId: session.connector.evseId,
    connectorStatus: 'Occupied',
    timestamp: clock.now().toISOString(),
  });
};

export default sendChargingLimitReached;
