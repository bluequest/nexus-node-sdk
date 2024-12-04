import nock from 'nock';
import { Config } from '@core/config';

export const setupHttpMock = (baseURL: string) => {
  Config.baseURL = baseURL;
  Config.publicKey = 'mockPublicKey';
  Config.privateKey = 'mockPrivateKey';
  return nock(baseURL);
};
