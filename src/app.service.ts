import { Client } from '@microsoft/microsoft-graph-client';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { ConfigService } from '@nestjs/config';
import { ClientSecretCredential } from '@azure/identity';
import {
  TokenCredentialAuthenticationProvider,
  TokenCredentialAuthenticationProviderOptions,
} from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import 'isomorphic-fetch';

@Injectable()
export class AppService {
  client: Client;

  constructor(private readonly configService: ConfigService) {
    // Create an instance of the TokenCredential class that is imported
    const tokenCredential = new ClientSecretCredential(
      this.configService.get<string>('AZURE_B2C_TENANT_ID'),
      this.configService.get<string>('AZURE_B2C_CLIENT_ID'),
      this.configService.get<string>('AZURE_B2C_CLIENT_SECRET'),
    );

    const options: TokenCredentialAuthenticationProviderOptions = {
      scopes: ['https://graph.microsoft.com/.default'],
    };

    // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
    const authProvider = new TokenCredentialAuthenticationProvider(
      tokenCredential,
      options,
    );

    this.client = Client.initWithMiddleware({
      debugLogging: true,
      authProvider: authProvider,
    });
  }

  async getUser(id: string): Promise<string> {
    const user: MicrosoftGraph.User = await this.client
      .api(`/users/${id}`)
      .get()
      .catch((error) => {
        Logger.error(`Response from Azure AD B2C while getting user: ${error}`);
        throw new InternalServerErrorException(`[Microsoft] ${error.message}`);
      });

    return user.displayName;
  }
}
