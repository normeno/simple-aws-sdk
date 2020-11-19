# Simple AWS SDK

Classes to make it easier to work with the AWS SDK

## Examples

### Initialize library

```js
const saws = new SAWS();

// SQS
const sqs = saws.sqs(null, null, null, process.env.AWS_QUEUE_URL);
```

### SQS

```js
const queues = await sqs.listQueues()
    .then((resp: IResponse) => resp)
    .catch((err: IResponse) => err);
```

### Get Queue url by queue name

```js
const queues = await sqs.getQueueUrlByName(process.env.AWS_QUEUE_NAME)
    .then((resp: IResponse) => resp)
    .catch((err: IResponse) => err);
```

### Send a message to queue

```js
const sendMessage = await sqs.sendMessage(message, groupId, deduplicationId)
    .then((resp: IResponse) => resp)
    .catch((err: IResponse) => err);
```

### Receive messages from queue

```js
const receiveMessage = await sqs.receiveMessages(1, 60, 0)
    .then((resp: IResponse) => resp)
    .catch((err: IResponse) => err);
```

### Delete a message from queue

```js
const deleteMessage = await sqs.deleteMessage(message.ReceiptHandle)
    .then((resp: IResponse) => resp)
    .catch((err: IResponse) => err);
```