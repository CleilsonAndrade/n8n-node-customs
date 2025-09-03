import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class ApiNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Buscador de Post Api',
    name: 'apiNode',
    group: ['transform'],
    version: 1,
    description: 'Busca um post da Api JSONPlaceholder',
    defaults: {
      name: 'Buscador de Posts',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [

    ]
  }

  // properties: [
  //     {
  //       displayName: 'Post ID',
  //       name: 'postId',
  //       type: 'number',
  //       default: '',
  //       description: 'O ID do post que voce deseja buscar',
  //       required: true,
  //     }
  //   ]

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Pega ps itens de entrada para podermos iterar sobre eles 
    const items = this.getInputData()
    const returnData: INodeExecutionData[] = []

    // URL base da nossa API
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts'

    for (let index = 0; index < items.length; index++) {
      try {
        // Pega o ID do post que o usuario digitou na interface
        // const postId = this.getNodeParameter('postId', index) as number
        const postId = 10

        // Monta a URL do post que o usuario digitou na interface
        const fullUrl = `${apiUrl}/${postId}`
        console.log('Buscando dados da URl', fullUrl)

        const response = await fetch(fullUrl)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))

          throw new NodeOperationError(
            this.getNode(),
            `Falha na chamada da API: ${response.statusText}`,
            { description: JSON.stringify(errorData, null, 2) },
          )
        }

        // Converte a resposta em JSON
        const data = await response.json()

        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
          throw new NodeOperationError(
            this.getNode(),
            'A API nao retornou um objeto JSON como esperado',
            { description: `Tipo recebido: ${typeof data}` }
          )
        }

        console.log('==========', data)

        returnData.push({
          json: data as IDataObject,
          pairedItem: { item: 1 }
        })
      } catch (error) {
        if (this.continueOnFail()) {
          items.push({ json: this.getInputData(index)[0].json, error, pairedItem: index })
        } else {
          if (error.context) {
            error.context.itemIndex = index
            throw error
          }
          throw new NodeOperationError(this.getNode(), error, {
            itemIndex: index
          })
        }
      }

    }

    return [returnData]
  }
}

