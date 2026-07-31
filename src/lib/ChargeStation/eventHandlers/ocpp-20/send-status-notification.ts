import { sleep } from '../../../../utils/csv';

import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';

import clock from '../../clock';

const sendStatusNotification: ChargeStationEventHandler = async ({
  chargepoint,
}) => {
  await sleep(1000);

  const anyAvailable = chargepoint.connectors.some(
    (c) => c.status === 'Available'
  );

  chargepoint.writeCall('StatusNotification', {
    timestamp: clock.now().toISOString(),
    connectorStatus: anyAvailable ? 'Available' : 'Occupied',
    evseId: 0,
    connectorId: 0,
  });

  for (const connector of chargepoint.connectors) {
    await sleep(2000);
    chargepoint.writeCall('StatusNotification', {
      timestamp: clock.now().toISOString(),
      connectorStatus: connector.status,
      evseId: connector.evseId,
      connectorId: connector.connectorId,
    });
  }
};

export default sendStatusNotification;
