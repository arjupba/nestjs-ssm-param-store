import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { AWSParamStoreModuleOptions } from './aws-param-store.interface';
import { AWS_PARAMS_STORE_MODULE_OPTIONS } from './contstants';

@Injectable()
export class AWSParamStoreService {
  private readonly logger = new Logger(AWSParamStoreService.name);
  private readonly client = new SSMClient({ region: 'us-east-1' });

  constructor(
    @Inject(AWS_PARAMS_STORE_MODULE_OPTIONS)
    private readonly options: AWSParamStoreModuleOptions,
  ) {
    if (this.options.paramsSource && this.options.isSetToEnv) {
      this.setAllParamsToEnv();
    }
  }

  async setAllParamsToEnv() {
    try {
      const params = await this.getAllParams();

      if (!params) {
        this.logger.warn('There is no params to set in env');

        return;
      }

      Object.keys(params).forEach((key) => {
        process.env[key] = JSON.stringify(params[key]);
      });

      this.logger.log(
        `All params from aws param store(id: ${JSON.stringify(
          this.options.paramsSource,
        )}) are set to env`,
      );

      if (this.options.isDebug) {
        this.logger.log(JSON.stringify(params, null, 2));
      }
    } catch (err: any) {
      this.logger.error(err.message);
    }
  }

  async getAllParams<T>() {
    try {
      const keys = Object.keys(this.options.paramsSource);

      if (!keys.length) {
        this.logger.log('Params source is empty');
      }

      const commands = keys.map(
        (key) =>
          new GetParameterCommand({ Name: this.options.paramsSource[key] }),
      );
      const resp = commands.map((command) =>
        this.options.parmStoreClient.send(command),
      );
      const params = await Promise.all(resp);
      const response = params.reduce((acc, param, index) => {
        const par = param.Parameter.Value;
        const paramObject = {};

        paramObject[keys[index]] = par;

        const allParams = {
          ...acc,
          ...paramObject,
        };

        return allParams;
      }, {});

      return response as T;
    } catch (e: any) {
      this.logger.error(`Unable to fetch params(${e.message})`);
    }
  }

  async getParamsByID<T>(paramName: string) {
    try {
      const command = new GetParameterCommand({ Name: paramName } as any);
      const param = await this.options.parmStoreClient.send(command);

      return param.Parameter.Value as T;
    } catch (e: any) {
      this.logger.error(`Unable to fetch params(${e.message})`);
    }
  }
}
