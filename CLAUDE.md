# CLAUDE.md

Guidance for AI agents working in this repository. Build, lint and test instructions are in the README.

## Terminology

- The physical unit is a "charging station", as OCPP 2.0.1 names it. Use that term for everything on the CPO side of the business, OCPP 1.6 context included. Do not write charge station, charge point, chargepoint, charger or EVSE for the unit.
- OCPI is a domain of its own and keeps its own vocabulary (Location, EVSE, Connector, CPO, eMSP) wherever the text is about OCPI.
- The back office is the CPMS (Charge Point Management System). OCPP 2.0.1 calls it the CSMS (Charging Station Management System) and OCPP 1.6 the Central System; use those names when the text is about the spec, and CPMS elsewhere.
- "EVSE controller" is the platform's record of a charging station. Never shorten it to "controller".
- Identifiers, API fields and protocol message names keep their spelling (`chargePoint`, `ChargePointId`, `ocppChargingStationId`, `BootNotification`). The rule covers prose, comments, UI copy, docs, commit messages and PR text, not code.
