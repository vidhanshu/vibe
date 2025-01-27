import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './common/guards/jwt.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { MediasModule } from './medias/medias.module';
import { StatusesModule } from './statuses/statuses.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronTasksModule } from './cron-tasks/cron-tasks.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PostsModule,
    MediasModule,
    StatusesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    CronTasksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
