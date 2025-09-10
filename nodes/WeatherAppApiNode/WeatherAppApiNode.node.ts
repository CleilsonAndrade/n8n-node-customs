import * as dotenv from 'dotenv';
import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

interface WeatherData {
	name: string;
	main: {
		temp: number;
		feels_like: number;
		humidity: number;
	};
	weather: Array<{
		description: string;
	}>;
	wind: {
		speed: number;
	};
}

interface ApiError {
	cod: string;
	message: string;
}

export class WeatherAppApiNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Weather App',
		name: 'weatherAppApi',
		icon: 'fa:cloud',
		group: ['transform'],
		description: 'Saiba o clima da sua cidade',
		version: 1,
		defaults: {
			name: 'Weather App',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		// credentials: [
		//   {
		//     name: 'weatherAppApi',
		//     required: true,
		//   }
		// ],
		properties: [
			{
				displayName: 'Nome Da Cidade',
				name: 'cityName',
				type: 'string',
				default: '',
				placeholder: 'Ex: Sao Paulo',
				description: 'O nome da cidade para saber o clima',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		dotenv.config();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (const _item of items) {
			const city = this.getNodeParameter('cityName', 0) as string;

			if (!city || city.trim() === '') {
				throw new NodeOperationError(this.getNode(), 'O nome da cidade não pode estar vazio.');
			}

			const apiKey = process.env.OPENWEATHERMAP_API_KEY;

			if (!apiKey) {
				throw new NodeOperationError(
					this.getNode(),
					'A variável de ambiente OPENWEATHERMAP_API_KEY não está configurada.',
				);
			}

			console.log(
				'Todas as env vars que contém WEATHER:',
				Object.keys(process.env).filter((key) => key.includes('WEATHER')),
			);
			console.log(
				'Todas as env vars que contém OPEN:',
				Object.keys(process.env).filter((key) => key.includes('OPEN')),
			);

			console.log('API Key:', apiKey);
			console.log('Tipo:', typeof apiKey);

			// const credentials = await this.getCredentials('weatherAppApi') as { apiKey: string }
			// const apiKey = credentials.apiKey;

			try {
				const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
				const response = await fetch(apiUrl);
				const data = (await response.json()) as WeatherData;

				if (response.status !== 200) {
					const errorData = data as unknown as ApiError;
					throw new NodeOperationError(
						this.getNode(),
						`Falha ao buscar dados climáticos: ${errorData.message}`,
					);
				}

				const weatherData = {
					cityName: data.name,
					temperature: data.main.temp,
					feelsLike: data.main.feels_like,
					humidity: data.main.humidity,
					description: data.weather[0].description,
					windSpeed: data.wind.speed,
				};

				console.log('Weather App====>', weatherData);

				returnData.push({ json: weatherData });
			} catch (error) {
				if (error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeOperationError(this.getNode(), error.message);
			}
		}

		return this.prepareOutputData(returnData);
	}
}
