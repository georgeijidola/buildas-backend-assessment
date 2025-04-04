import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TasksModule } from './domain/tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), CommonModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
