import './util/module-alias';
import expressPino from 'express-pino-logger';
import cors from 'cors';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import * as database from '@src/database';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';
import logger from './logger';
export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(
      expressPino({
        logger,
      })
      );
    //add cors
    this.app.use(cors);

    // this.app.use(cors({ origin: '*' }));
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([
      forecastController,
      beachesController,  
      usersController,
    ]);
  }

  public async close(): Promise<void> {
    await database.close();
  }
  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server lintening of port:', this.port);
    });
  }
}
