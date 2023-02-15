import {
  useFlowInstances,
  useFlows,
  useIntegration,
  useIntegrationApp,
} from "@integration-app/react";
import { useState } from "react";

function IntegrationPage(props) {
  const integrationKey = props?.integrationKey;
  const {
    integration,
    loading: integrationLoading,
    error: integrationError,
  } = useIntegration(integrationKey);
  const { items: flows, loading: flowsLoading, error: flowsError } = useFlows();
  const {
    items: flowInstances,
    loading: flowInstancesLoading,
    error: flowInstancesError,
  } = useFlowInstances({ integrationKey: integrationKey });
  const integrationApp = useIntegrationApp();
  const [state, setState] = useState(false);
  // Merge flows with Instances to display if Integration is enabled for User
  flowInstances.map((flowInstance) => {
    flows.map((flow) => {
      if (flowInstance.flowId == flow.id) {
        flow.instance = flowInstance;
      }
    });
  });
  console.log(flows, flowInstances);

  if (state) {
    setState(false);
  }
  const loaded = !(integrationLoading || flowsLoading || flowInstancesLoading);
  if (loaded && integration && integration.logoUri) {
    return (
      <>
        <div className="integrationpg_sec">
          <button
            className="btn btn-sm m-2 btn-back"
            onClick={() => {
              props.HandleIntegration("");
            }}
          >
            Back
          </button>
          <div className="">
            <div className="avatar mt-4">
              <div className="w-24 rounded">
                <img src={integration.logoUri} />
              </div>
            </div>
            <h1>{integration.name}</h1>
            <table className="table table_integrationPg w-full">
              <tbody>
                {flows.map((flow, f) => {
                  return (
                    <tr key={"integrationPg_" + f}>
                      <td className="form-switch">
                        <input
                          type="checkbox"
                          role="switch"
                          className="toggle form-check-input m-0"
                          defaultChecked={
                            flow.instance ? flow.instance.enabled : false
                          }
                          onClick={async () => {
                            if (flow.instance) {
                              await integrationApp
                                .flowInstance(flow.instance.id)
                                .patch({
                                  enabled: !flow.instance.enabled,
                                });
                            } else {
                              // Create Flow Instance for that user, since it wasn't create yet
                              flow.instance = await integrationApp
                                .flowInstance({
                                  flowId: flow.id,
                                  integrationKey: integrationKey,
                                  autoCreate: true,
                                })
                                .get();
                            }
                            setState(true);
                          }}
                        />
                      </td>
                      <td>{flow.name}</td>
                      <td>
                        {flow.instance && flow.instance.enabled ? (
                          <button
                            className="btn btn-sm m-2"
                            onClick={() => {
                              integrationApp
                                .flowInstance(flow.instance.id)
                                .openConfiguration();
                            }}
                          >
                            Configure
                          </button>
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
  return null;
}

export default IntegrationPage;
