import { OnQueueActive, OnQueueEvent, BullQueueEvents } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

export abstract class BaseQueueProcessor {
  protected abstract logger: Logger;

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${
        job.name
      } with data \n ${JSON.stringify(job.data, null, 2)}...`,
    );
  }

  @OnQueueEvent(BullQueueEvents.COMPLETED)
  onCompleted(job: Job) {
    this.logger.log(
      `Completed job ${job.id} of type ${job.name} with result ${JSON.stringify(
        job.returnvalue,
        null,
        2,
      )}`,
    );
  }
}
