import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'isomorphic-fetch';

/**
 * Auth Provider for providing the authentication with Azure B2C.
 */
export class AuthProvider implements AuthenticationProvider {
  private token: string;
  private tokenExpires: Date;

  constructor(private readonly configService: ConfigService) {}

  /**
   * This method will get called before every request to the msgraph server
   * This should return a Promise that resolves to an accessToken (in case of success) or rejects with error. (in case of failure)
   */
  public async getAccessToken(): Promise<string> {
    Logger.debug('Access token was requested', 'AuthProvider');

    return new Promise<string>((resolve) => {
      if (this.token && this.tokenExpires && this.tokenExpires > new Date()) {
        return resolve(this.token);
      }

      return resolve(this.requestNewAzureB2cToken());
    });
  }

  private async requestNewAzureB2cToken(): Promise<string> {
    Logger.debug('Requesting fresh Azure B2C token', 'AuthProvider');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ClientOAuth2 = require('client-oauth2');

    const microsoftAuth = new ClientOAuth2({
      clientId: this.configService.get<string>('AZURE_B2C_CLIENT_ID'),
      clientSecret: this.configService.get<string>('AZURE_B2C_CLIENT_SECRET'),
      accessTokenUri: this.configService.get<string>(
        'AZURE_B2C_ACCESS_TOKEN_URI',
      ),
      scopes: ['https://graph.microsoft.com/.default'],
    });

    await microsoftAuth.credentials
      .getToken()
      .then((data) => {
        this.token = data.accessToken;
        // Tokens are valid for 60 mins by default
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 59);
        this.tokenExpires = expiresAt;
      })
      .catch((e) => {
        Logger.error(
          `Response from Azure AD B2C while trying to get access token: ${e}`,
          null,
          'AuthProvider',
        );
        throw new Error(
          '[Microsoft] Could not get B2C access token. More details in the logs.',
        );
      });

    return this.token;
  }
}
