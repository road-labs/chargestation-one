export default async function sendStatusNotificationPreparing({
  chargepoint,
  session,
}) {
  if (session.connectorStatus === 'Preparing') {
    return;
  }

  await chargepoint.writeCall(
    'StatusNotification',
    {
      connectorId: session.connectorNumber,
      errorCode: 'NoError',
      status: 'Preparing',
    },
    session
  );
}
