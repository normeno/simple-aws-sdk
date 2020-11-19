export interface IReceiveParams {
  QueueUrl: string;
  MaxNumberOfMessages: number;
  VisibilityTimeout: number;
  WaitTimeSeconds: number;
}

export interface ISendParams {
  MessageBody: string;
  QueueUrl: string;
  MessageGroupId: string;
  MessageDeduplicationId: string;
}

export interface IMetadataResponse {
  RequestId: string;
}

export interface ICreatedMessage {
  ResponseMetadata: IMetadataResponse;
  MD5OfMessageBody: string;
  MessageId: string;
  SequenceNumber: string;
}

export interface IMessage {
  MessageId: string;
  ReceiptHandle: string;
  MD5OfBody: string;
  Body: string;
}

export interface IReceiveMessages {
  ResponseMetadata: IMetadataResponse;
  Messages: Array<IMessage>;
}

export interface ISQSResponse {
  status: boolean;
  data: any;
}

export interface IlistQueues {
  ResponseMetadata: IMetadataResponse,
  QueueUrls: Array<string>
}

export interface IQueueUrl {
  ResponseMetadata: IMetadataResponse,
  QueueUrl: string
}