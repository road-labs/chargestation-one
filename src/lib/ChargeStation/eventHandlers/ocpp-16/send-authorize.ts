// Define custom handlers for each event and put them in the handlerConfig
import { sleep } from '../../../../utils/csv';
import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { AuthorizeRequest } from 'schemas/ocpp/1.6/Authorize';

const sendAuthorize: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  await sleep(1000);
  chargepoint.writeCall<AuthorizeRequest>(
    'Authorize',
    {
      idTag: session.options.uid,
    },
    session
  );
};

export default sendAuthorize;
