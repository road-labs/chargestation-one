import React from 'react';
import { Modal, Button, Form, Divider } from 'semantic';
import modal from 'helpers/modal';

function selectDefaultConnector(connectors, availableConnectors) {
  const occupied = connectors.find(
    (c) => !availableConnectors.includes(c.connectorNumber.toString())
  );
  return occupied?.connectorNumber.toString();
}

@modal
export default class StopSessionModal extends React.Component {
  state = {
    session: this.props.session,
    connectorNumber: selectDefaultConnector(
      this.props.connectors,
      this.props.availableConnectors
    ),
  };
  componentDidUpdate(prevProps) {
    if (
      prevProps.availableConnectors.length !==
      this.props.availableConnectors.length
    ) {
      this.setState({
        connectorNumber: selectDefaultConnector(
          this.props.connectors,
          this.props.availableConnectors
        ),
      });
    }
  }
  onSubmit = () => {
    this.props.onSave(this.state);
    this.props.close();
  };
  render() {
    const { connectorNumber } = this.state;
    const { availableConnectors, connectors } = this.props;

    const connectorOptions = connectors.map((c) => {
      const key = c.connectorNumber.toString();
      return {
        key,
        text: `Connector ${key}`,
        value: key,
        disabled: availableConnectors.includes(key),
      };
    });
    return (
      <>
        <Modal.Header>Stop Session</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.onSubmit} id="edit-stop-session">
            <Form.Dropdown
              label="Connector"
              options={connectorOptions}
              selection
              value={connectorNumber}
              onChange={(e, { value }) => {
                this.setState({ connectorNumber: value });
              }}
            />
            <Divider hidden />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button primary form="edit-stop-session" content="Stop" />
        </Modal.Actions>
      </>
    );
  }
}
