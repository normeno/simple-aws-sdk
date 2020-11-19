import * as assert from "assert";
import SAWS from "../src/SAWS";
import { IResponse } from "../src/interfaces/ICommon";
import {
  IlistQueues,
  IQueueUrl,
  IReceiveMessages,
  ICreatedMessage,
  IMessage
} from "../src/interfaces/ISQS";

const saws = new SAWS();
const sqs = saws.sqs(null, null, null, process.env.AWS_QUEUE_URL);
const sqsErr = saws.sqs("foo", "bar", null, null);

describe("#listQueues", () => {
  test("Success", async () => {
    const queues = await sqs.listQueues()
      .then((resp: IResponse) => resp)
      .catch((err: IResponse) => err);
  
    const data: IlistQueues = queues.data;
    expect(queues.status).toBe(true);
    expect(Array.isArray(data.QueueUrls)).toBe(true);
  });

  test("Error", async () => {
    const queues = await sqsErr.listQueues()
      .then((resp: IResponse) => resp)
      .catch((err: IResponse) => err);
  
    const data: IlistQueues = queues.data;
    expect(queues.status).toBe(false);
  });
});

describe("#getQueueUrlByName", () => {
  test("Success", async () => {
    const queues = await sqs.getQueueUrlByName(process.env.AWS_QUEUE_NAME)
      .then((resp: IResponse) => resp)
      .catch((err: IResponse) => err);
  
      const data: IQueueUrl = queues.data;
      expect(queues.status).toBe(true);
      expect(typeof data.QueueUrl).toBe("string");
  });

  test("Error", async () => {
    const queues = await sqsErr.getQueueUrlByName(process.env.AWS_QUEUE_NAME)
      .then((resp: IResponse) => resp)
      .catch((err: IResponse) => err);
  
      const data: IQueueUrl = queues.data;
      expect(queues.status).toBe(false);
  });
});

describe("#sendMessage", () => {
  const message: string = JSON.stringify({message: "I'm a message"});
  const groupId: string = "my-group";
  const deduplicationId: string = new Date().toISOString();
  const queueUrl = process.env.AWS_QUEUE_URL;

  test("Success", async () => {
    const sendMessage = await sqs.sendMessage(message, groupId, deduplicationId)
      .then((resp: IResponse) => resp)
      .catch((err: IResponse) => err);
  
    const createdMessage: ICreatedMessage = sendMessage.data;
    expect(sendMessage.status).toBe(true);
    expect(createdMessage).toHaveProperty("MessageId");
  });

  test("Error", async () => {
    const sendMessage = await sqsErr.sendMessage(message, groupId, deduplicationId)
      .then((resp: IResponse) => resp)
      .catch((err: IResponse) => err);
  
    const createdMessage: ICreatedMessage = sendMessage.data;
    expect(sendMessage.status).toBe(false);
  });
});

describe("#receiveMessages", () => {
  test("Success", async () => {
    const receiveMessage = await sqs.receiveMessages(1, 60, 0)
      .then((resp: IResponse) => resp)
      .catch((err: IResponse) => err);
  
    const response: IReceiveMessages = receiveMessage.data;
    console.log(response);
    expect(receiveMessage.status).toBe(true);
    expect(Array.isArray(response.Messages)).toBe(true);
  });

  test("Error", async () => {
    const receiveMessage = await sqsErr.receiveMessages(1, 60, 0)
      .then((resp: IResponse) => resp)
      .catch((err: IResponse) => err);
  
    const response: IReceiveMessages = receiveMessage.data;
    console.log(response);
    expect(receiveMessage.status).toBe(false);
  });
});

describe("#deleteMessage", () => {
  test("Error", async () => {
    const receiveMessage = await sqs.receiveMessages(1, 60, 0)
    .then((resp: IResponse) => resp)
    .catch((err: IResponse) => err);

    const response: IReceiveMessages = receiveMessage.data;

    if (response.Messages) {
      const messages: Array<IMessage> = response.Messages;
      const message = messages[0];
      const deleteMessage = await sqsErr.deleteMessage(message.ReceiptHandle)
        .then((resp: IResponse) => resp)
        .catch((err: IResponse) => err);
  
      expect(deleteMessage.status).toBe(false);
    }
  });

  test("Success", async () => {
    const receiveMessage = await sqs.receiveMessages(1, 60, 0)
    .then((resp: IResponse) => resp)
    .catch((err: IResponse) => err);

    const response: IReceiveMessages = receiveMessage.data;

    if (response.Messages) {
      const messages: Array<IMessage> = response.Messages;
      const message = messages[0];
      const deleteMessage = await sqs.deleteMessage(message.ReceiptHandle)
        .then((resp: IResponse) => resp)
        .catch((err: IResponse) => err);
  
      expect(deleteMessage.status).toBe(true);
    }
  });
});