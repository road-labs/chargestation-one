import DefaultOCPP16 from './default-ocpp-16';
import DefaultOCPP20 from './default-ocpp-20';
import DefaultOCPP21 from './default-ocpp-21';
import AlpitronicCCVOCPP16 from './alpitronic-ccv-ocpp-16';
import SichargeOCPP16 from './sicharge-ocpp-16';
import AdsTecOCPP16 from './ads-tec-ocpp-16';
import ETotemOCPP16 from './e-totem-ocpp-16';
import MadicLafonOCPP16 from './madic-lafon-ocpp-16';
import EVBoxOCPP16 from './evbox-ocpp-16';
import DbtOCPP16 from './dbt-ocpp-16';
import G2MobilityOCPP16 from 'lib/ChargeStation/configurations/g2mobility-ocpp-16';
import NidecOCPP16 from 'lib/ChargeStation/configurations/nidec-ocpp-16';
import AutelOCPP16 from 'lib/ChargeStation/configurations/autel-ocpp-16';
import ABBOCPP16 from 'lib/ChargeStation/configurations/abb-ocpp-16';
import IESOCPP16 from 'lib/ChargeStation/configurations/ies-ocpp-16';

const options = {
  'default-ocpp1.6': DefaultOCPP16,
  'default-ocpp2.0.1': DefaultOCPP20,
  'default-ocpp2.1': DefaultOCPP21,
  'ccv-alpitronic-ocpp1.6': AlpitronicCCVOCPP16,
  'sicharge-ocpp1.6': SichargeOCPP16,
  'ads-tec-ocpp1.6': AdsTecOCPP16,
  'e-totem-ocpp1.6': ETotemOCPP16,
  'madic/lafon-ocpp1.6': MadicLafonOCPP16,
  'evbox-ocpp1.6': EVBoxOCPP16,
  'dbt-ocpp1.6': DbtOCPP16,
  'g2mobility-ocpp1.6': G2MobilityOCPP16,
  'nidec-ocpp1.6': NidecOCPP16,
  'autel-ocpp1.6': AutelOCPP16,
  'abb-ocpp1.6': ABBOCPP16,
  'ies-ocpp1.6': IESOCPP16,
};

export function getOCPPConfiguration(ocppVersion, model) {
  return options[`${model.toLowerCase()}-${ocppVersion}`];
}
