import { Module, DynamicModule } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import { DomainModule } from './domain/domain.module';
import { ApplicationModule } from './application/application.module';
import { PersistenceModule } from './persistence/persistence.module';
import { ControllersModule } from './controllers/controllers.module';

@Module({ 
})
export class AppModule {
  static foorRoot(setting: any):DynamicModule{
    return {
      module:AppModule,
      imports:[
        CommonModule,
        DomainModule,
        ApplicationModule,
        PersistenceModule.foorRoot(setting),
        ControllersModule,
      ]
    }
  }
}
