import nock from 'nock';
import { Config } from '../src/core/config';

export const setupHttpMock = (baseURL: string) => {
  Config.baseURL = baseURL;
  Config.publicKey = 'mockPublicKey';
  Config.privateKey = 'mockPrivateKey';
  return nock(baseURL);
};
