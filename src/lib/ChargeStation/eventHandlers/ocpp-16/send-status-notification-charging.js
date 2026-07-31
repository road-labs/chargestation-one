export default async function sendStatusNotificationCharging({
  chargepoint,
  session,
}) {
  await chargepoint.writeCall(
    'StatusNotification',
    {
      connectorId: session.connectorNumber,
      errorCode: 'NoError',
      status: 'Charging',
      info: 'Charging',
    },
    session
  );
}
