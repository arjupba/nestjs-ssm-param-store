import { SSMClient } from '@aws-sdk/client-ssm';
import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface AWSParamStoreModuleOptions {
  parmStoreClient: SSMClient;
  isSetToEnv?: boolean;
  paramsSource?: object;
  isDebug?: boolean;
}

export interface AWSParamStoreModuleOptionsFactory {
  createAWSSecrectsManagerModuleOptions():
    | Promise<AWSParamStoreModuleOptions>
    | AWSParamStoreModuleOptions;
}

export interface AWSParamStoreModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<AWSParamStoreModuleOptions> | AWSParamStoreModuleOptions;
  inject?: any[];
  useClass?: Type<AWSParamStoreModuleOptionsFactory>;
}
