import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { getPublicKey } from 'lib/ChargeStation/ocmf';
import { sleep } from 'utils/csv';

export const sendMeterConfiguration: ChargeStationEventHandler = async (
  params
) => {
  const { chargepoint } = params;

  if (!chargepoint.settings.privateKey) {
    return;
  }

  const publicKey = await getPublicKey(chargepoint);
  if (!publicKey) {
    return;
  }

  await sleep(2000);

  for (const connector of chargepoint.connectors) {
    chargepoint.writeCall('DataTransfer', {
      vendorId: 'generalConfiguration',
      messageId: 'setMeterConfiguration',
      data: JSON.stringify({
        meters: [
          {
            connectorId: connector.connectorNumber,
            meterSerial: '1234567',
            type: 'SIGNATURE',
            publicKey,
          },
        ],
      }),
    });
    await sleep(200);
  }
};
