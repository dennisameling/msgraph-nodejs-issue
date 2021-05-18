import { Client } from '@microsoft/microsoft-graph-client';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AuthProvider } from './auth.provider';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = Client.initWithMiddleware({
      authProvider: new AuthProvider(this.configService),
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
