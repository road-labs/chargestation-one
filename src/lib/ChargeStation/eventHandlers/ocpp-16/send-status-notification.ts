import { sleep } from '../../../../utils/csv';
import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';

const sendStatusNotification: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  await sleep(1000);

  const numConnectors = Number(
    chargepoint.configuration.getVariableValue('NumberOfConnectors')
  );

  for (let i = 0; i < numConnectors; i++) {
    const connectorId = i + 1;

    chargepoint.writeCall(
      'StatusNotification',
      {
        connectorId,
        errorCode: 'NoError',
        status: chargepoint.currentStatus[connectorId],
      },
      session
    );
  }
};

export default sendStatusNotification;
