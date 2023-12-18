import { DynamicModule, Global, Module } from '@nestjs/common';

import {
  AWSParamStoreModuleAsyncOptions,
  AWSParamStoreModuleOptions,
} from './aws-param-store.interface';
import {
  createAWSParamStoreAsyncProviders,
  createAWSParamStoreProviders,
} from './aws-param-store.provider';
import { AWSParamStoreService } from './aws-param-store.service';

@Global()
@Module({})
export class AWSParamStoreModule {
  static forRoot(options: AWSParamStoreModuleOptions): DynamicModule {
    const providers = createAWSParamStoreProviders(options);

    return {
      exports: [AWSParamStoreService],
      module: AWSParamStoreModule,
      providers,
    };
  }

  public static forRootAsync(
    options: AWSParamStoreModuleAsyncOptions,
  ): DynamicModule {
    const providers = createAWSParamStoreAsyncProviders(options);

    return {
      exports: providers,
      imports: options.imports,
      module: AWSParamStoreModule,
      providers: providers,
    } as DynamicModule;
  }
}
