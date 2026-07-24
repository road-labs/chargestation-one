import { sleep } from '../../../../utils/csv';

import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';

import clock from '../../clock';
const sendStatusNotificationAvailable: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  await sleep(1000);

  if (session?.connectorId) {
    chargepoint.writeCall('StatusNotification', {
      timestamp: clock.now().toISOString(),
      connectorStatus: 'Available',
      evseId: 1,
      connectorId: session.connectorId,
    });
    return;
  }

  chargepoint.writeCall('StatusNotification', {
    timestamp: clock.now().toISOString(),
    connectorStatus: 'Available',
    evseId: 0,
    connectorId: 0,
  });

  await sleep(2000);

  chargepoint.writeCall('StatusNotification', {
    timestamp: clock.now().toISOString(),
    connectorStatus: 'Available',
    evseId: 1,
    connectorId: 1,
  });

  await sleep(2000);

  chargepoint.writeCall('StatusNotification', {
    timestamp: clock.now().toISOString(),
    connectorStatus: 'Available',
    evseId: 1,
    connectorId: 2,
  });
};

export default sendStatusNotificationAvailable;
