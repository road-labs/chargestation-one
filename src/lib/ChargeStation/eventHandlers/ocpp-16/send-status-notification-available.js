import { sleep } from '../../../../utils/csv';

export default async function sendStatusNotificationAvailable({
  chargepoint,
  session,
}) {
  await sleep(1000);

  if (session?.connectorNumber) {
    await chargepoint.writeCall('StatusNotification', {
      connectorId: session.connectorNumber,
      errorCode: 'NoError',
      status: 'Available',
    });
    return;
  }

  for (const connector of chargepoint.connectors) {
    await chargepoint.writeCall(
      'StatusNotification',
      {
        connectorId: connector.connectorNumber,
        errorCode: 'NoError',
        status: 'Available',
      },
      session
    );
  }
}
