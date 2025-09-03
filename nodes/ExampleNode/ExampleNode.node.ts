import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';


import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class ExampleNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Example Node',
		name: 'exampleNode',
		group: ['transform'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {
			name: 'Example Node',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Minha Frase',
				name: 'minhaFrase',
				type: 'string',
				default: '',
				placeholder: 'Valor padrão',
				description: 'O texto para descrição',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		// Log para saber quando o node começou a ser executado
		console.log('--- INÍCIO DA EXECUÇÃO DO MEU NODE CUSTOMIZADO ---');

		let item: INodeExecutionData;
		let minhaFrase: string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				minhaFrase = this.getNodeParameter('minhaFrase', itemIndex, '') as string;
				item = items[itemIndex];

				// Log para cada item processado
				console.log(`[Item ${itemIndex}] Processando com a frase: "${minhaFrase}"`);

				// Log para ver o conteúdo do item ANTES da modificação
				console.log(`[Item ${itemIndex}] JSON de entrada:`, JSON.stringify(item.json, null, 2));

				item.json.minhaFrase = minhaFrase;

				// Log para ver o conteúdo do item DEPOIS da modificação
				console.log(`[Item ${itemIndex}] JSON de saída:`, JSON.stringify(item.json, null, 2));


			} catch (error) {
				console.error(`[Item ${itemIndex}] Ocorreu um erro:`, error);
				// O tratamento de erro original continua aqui...
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		console.log('--- FIM DA EXECUÇÃO DO MEU NODE CUSTOMIZADO ---');
		return [items];
	}
}
