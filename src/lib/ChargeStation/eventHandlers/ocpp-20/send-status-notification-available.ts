import { sleep } from '../../../../utils/csv';

import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';

import clock from '../../clock';

const sendStatusNotificationAvailable: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  await sleep(1000);

  if (session?.connectorNumber) {
    const connector = session.connector;
    chargepoint.writeCall('StatusNotification', {
      timestamp: clock.now().toISOString(),
      connectorStatus: 'Available',
      evseId: connector.evseId,
      connectorId: connector.connectorId,
    });
    return;
  }

  chargepoint.writeCall('StatusNotification', {
    timestamp: clock.now().toISOString(),
    connectorStatus: 'Available',
    evseId: 0,
    connectorId: 0,
  });

  for (const connector of chargepoint.connectors) {
    await sleep(2000);
    chargepoint.writeCall('StatusNotification', {
      timestamp: clock.now().toISOString(),
      connectorStatus: 'Available',
      evseId: connector.evseId,
      connectorId: connector.connectorId,
    });
  }
};

export default sendStatusNotificationAvailable;
