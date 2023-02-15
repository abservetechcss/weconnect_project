import {
  useFlowInstances,
  useFlows,
  useIntegration,
  useIntegrationApp,
  useIntegrations,
} from "@integration-app/react";
import { useParams } from "react-router-dom";
import { useState } from "react";

function IntegrationsList(props) {
  const { items, loading, error, refresh } = useIntegrations();
  const integrationApp = useIntegrationApp();

  if (!loading && !error) {
    return (
      <table className="table table_integrationList w-full mt-4">
        <tbody>
          {items.map((integration, i) => (
            <tr key={"integration_" + i}>
              <td>
                <div className="avatar">
                  <div className="w-16 h-16">
                    <img className="App-logo" src={integration.logoUri} />
                  </div>
                </div>
              </td>
              <td>{integration.name}</td>
              <td>
                {integration.connection ? (
                  <>
                    <button
                      className="btn btn-sm m-2"
                      onClick={() => {
                        // console.log("/integrations/" + integration.key);
                        props.HandleIntegration(integration.key);
                      }}
                    >
                      Configure
                    </button>
                    <button
                      className="btn btn-sm m-2"
                      onClick={async () => {
                        await integrationApp
                          .connection(integration.connection.id)
                          .archive();
                        refresh();
                      }}
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    data-value={integration.key}
                    className="btn btn-sm m-2"
                    onClick={async () => {
                      await integrationApp
                        .integration(integration.key)
                        .connect();
                      refresh();
                    }}
                  >
                    Connect
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return null;
}

export default IntegrationsList;
