import SQS from "./SQS";

export default class SAWS {
  
  constructor() {}

  sqs(accessKey: string, secretKey: string, region: string, queueUrl: string) {
    return new SQS(accessKey, secretKey, region, queueUrl);
  }
}