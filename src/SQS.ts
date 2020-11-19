import AWS from "aws-sdk";
import { IResponse } from "./interfaces/ICommon";
import {
  ISendParams,
  IReceiveParams
} from "./interfaces/ISQS";
require('dotenv').config();

export default class SQS {
  apiVersion: string;
  sqs: AWS.SQS;
  queueUrl: string;

  constructor(accessKey: string, secretKey: string, region: string, queueUrl: string) {
    AWS.config.update(this.setConnection(accessKey, secretKey, region));
    this.apiVersion = this.getSQSApiVersion();
    this.sqs = new AWS.SQS({apiVersion: this.apiVersion});
    this.queueUrl = queueUrl;
  }

  /**
   * Set queue connection parameters
   */
  setConnection(accessKey: string, secretKey: string, region: string) {
    return {
      accessKeyId: accessKey || process.env.AWS_ACCESS_KEY,
      secretAccessKey: secretKey || process.env.AWS_SECRET_KEY,
      region: region || process.env.AWS_REGION
    };
  }

  /**
   * Set the AWS SQS Api Version
   */
  getSQSApiVersion() {
    return "2012-11-05";
  }

  /**
   * List all queues
   */
  async listQueues() {
    return this.sqs.listQueues({}).promise()
      .then(data => this.setResponse(true, data))
      .catch(err => this.setResponse(false, err));
  }

  async getQueueUrlByName(queueName: string) {
    const params = {
      QueueName: queueName
    };

    return this.sqs.getQueueUrl(params).promise()
      .then(data => this.setResponse(true, data))
      .catch(err => this.setResponse(false, err));
  }

  /**
   * Send message to queue
   * 
   * @param body 
   * @param MessageGroupId 
   * @param MessageDeduplicationId 
   */
  async sendMessage(body: string, MessageGroupId: string, MessageDeduplicationId: string) {
    const params: ISendParams = {
      MessageBody: JSON.stringify(body),
      QueueUrl: this.queueUrl,
      MessageGroupId,
      MessageDeduplicationId
    };

    return this.sqs.sendMessage(params).promise()
      .then(response => this.setResponse(true, response))
      .catch(err => this.setResponse(false, err));
  }

  /**
   * Get Message from queue
   * 
   * @param MaxNumberOfMessages 
   * @param VisibilityTimeout 
   * @param WaitTimeSeconds 
   * @param queueUrl 
   */
  async receiveMessages(MaxNumberOfMessages: number, VisibilityTimeout: number, WaitTimeSeconds: number) {
    const receiveParams: IReceiveParams = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages,
      VisibilityTimeout,
      WaitTimeSeconds
    };

    return this.sqs.receiveMessage(receiveParams).promise()
      .then(response => this.setResponse(true, response))
      .catch(err => this.setResponse(false, err));
  }

  /**
   * Delete a queued message
   * 
   * @param ReceiptHandle 
   */
  async deleteMessage(ReceiptHandle: string) {
    const deleteParams = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: ReceiptHandle
    };

    return this.sqs.deleteMessage(deleteParams).promise()
      .then(response => this.setResponse(true, response))
      .catch(err => this.setResponse(false, err));
  }

  /**
   * Set class response 
   */
  setResponse(status: boolean, data: any) {
    const response: IResponse = {
      status,
      data
    };

    return response;
  }
}