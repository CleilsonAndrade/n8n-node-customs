import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class WeatherAppApi implements ICredentialType {
	name = 'weatherAppApi';
	displayName = 'WeatherApp API';
	documentationUrl =
		'https://docs.n8n.io/integrations/creating-nodes/build/declarations/credential-declarations/';

	properties: INodeProperties[] = [
		{
			name: 'apiKey',
			displayName: 'WeatherApp API Key',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			placeholder: 'Sua Chave da API',
			description: 'Sua chave de API da OpenWeatherMap',
		},
	];
}
