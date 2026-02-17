// TODO: Improve this interface. Preferably based on the OCPP 2.0.1 specification types
interface SummarizeCommandParams {
  method: string;
  params: {
    meterStart?: number;
    meterStop?: number;
    idTag?: string;
    status?: string;
    meterValue?: {
      sampledValue: {
        value: number;
        unit?: string;
        unitOfMeasure?: { unit?: string };
      }[];
    }[];
  };
}

export function summarizeCommandParams({
  method,
  params: { idTag, meterStart, meterStop, meterValue, status },
}: SummarizeCommandParams) {
  switch (method) {
    case 'StartTransaction':
      return { meterStart, uid: idTag };
    case 'StopTransaction':
      return { meterStop, uid: idTag };
    case 'Authorize':
      return { uid: idTag };
    case 'StatusNotification':
      return { status };
    case 'MeterValues': {
      const sampled = meterValue?.[0]?.sampledValue[0];
      const unit = sampled?.unit ?? 'Wh';
      return {
        [unit]: sampled?.value,
      };
    }
    case 'TransactionEvent': {
      const energyMeter = meterValue
        ?.filter((mv) => mv.sampledValue[0]?.unitOfMeasure?.unit !== 'Percent')
        .pop();
      const sampled = energyMeter?.sampledValue[0];
      const unit = sampled?.unitOfMeasure?.unit ?? 'Wh';
      return {
        [unit]: sampled?.value,
      };
    }
  }

  return null;
}

export function toCamelCase(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}
