import { Provider, Type } from '@nestjs/common';

import {
  AWSParamStoreModuleAsyncOptions,
  AWSParamStoreModuleOptions,
  AWSParamStoreModuleOptionsFactory,
} from './aws-param-store.interface';
import { AWSParamStoreService } from './aws-param-store.service';
import { AWS_PARAMS_STORE_MODULE_OPTIONS } from './contstants';

export function createAWSParamStoreProviders(
  options: AWSParamStoreModuleOptions,
): Provider[] {
  return [
    AWSParamStoreService,
    {
      provide: AWS_PARAMS_STORE_MODULE_OPTIONS,
      useValue: options,
    },
  ];
}

export function createAWSParamStoreAsyncProviders(
  options: AWSParamStoreModuleAsyncOptions,
): Provider[] {
  const providers: Provider[] = [AWSParamStoreService];

  if (options.useClass) {
    const useClass =
      options.useClass as Type<AWSParamStoreModuleOptionsFactory>;

    providers.push(
      ...[
        {
          inject: [useClass],
          provide: AWS_PARAMS_STORE_MODULE_OPTIONS,
          useFactory: async (
            optionsFactory: AWSParamStoreModuleOptionsFactory,
          ) => await optionsFactory.createAWSSecrectsManagerModuleOptions(),
        },
        {
          provide: useClass,
          useClass,
        },
      ],
    );
  }

  if (options.useFactory) {
    providers.push({
      inject: options.inject || [],
      provide: AWS_PARAMS_STORE_MODULE_OPTIONS,
      useFactory: options.useFactory,
    });
  }

  return providers;
}
