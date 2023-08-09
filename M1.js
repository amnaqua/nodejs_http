const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const app = express();
app.use(bodyParser.json());

const config = require('./config.json');
const rabbitMQUrl = config.rabbitMQUrl;

// Middleware для логирования
app.use((req, res, next) => {
  console.log(`Received HTTP request: ${req.method} ${req.url}`);
  next();
});

app.post('/', async (req, res) => {
  try {
    const requestPayload = req.body; // Предполагается, что тело запроса содержит данные задания

    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(config.taskQueue);
    await channel.sendToQueue(config.taskQueue, Buffer.from(JSON.stringify(requestPayload)));

    // Ожидание результата обработки задания
    channel.consume(config.resultQueue, (msg) => {
      const result = JSON.parse(msg.content.toString());
      res.status(200).json(result);
      channel.ack(msg);
    }, { noAck: false });

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error while processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(config.port, () => {
  console.log(`M1 microservice listening on port ${config.port}`);
});