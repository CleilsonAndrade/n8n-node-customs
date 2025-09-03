import type {
  IDataObject,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class SimulatedApiTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'API Simulada com parâmetros',
    name: 'simulatedApiTrigger',
    icon: 'fa:satellite-dish',
    group: ['trigger'],
    version: 1,
    description: 'Inicia um workflow a partir de uma chamada GET com parâmetros na URL',
    defaults: {
      name: 'API Simulada',
    },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    properties: [],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'GET',
        responseMode: 'onReceived',
        path: 'simulated-api',
      },
    ],
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const query = req.query;

    const nome = (query.nome as string) || 'Mundo';

    const workflowJsonData: IDataObject = {
      message: `Olá, ${nome}`,
      receivedAt: new Date().toISOString(),
    };

    const response = {
      status: 'success',
      message: `Workflow iniciado para ${nome}`,
    };

    return {
      workflowData: [[{ json: workflowJsonData }]],
      webhookResponse: response,
    };
  }
}
