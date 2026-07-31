import { sleep } from '../../../../utils/csv';
import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';

const sendStatusNotification: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  await sleep(1000);

  for (const connector of chargepoint.connectors) {
    chargepoint.writeCall(
      'StatusNotification',
      {
        connectorId: connector.connectorNumber,
        errorCode: 'NoError',
        status: connector.status,
      },
      session
    );
  }
};

export default sendStatusNotification;
