const amqp = require('amqplib');

const config = require('./config.json');
const rabbitMQUrl = config.rabbitMQUrl;

// Функция для обработки задания
async function processTask(task) {
  // Обработка запроса
  if (task.type === 'request') {
    console.log('Received request:', task.request);
  }

  // Обработка задания
  const result = task; // Результатом обработки задания будет само задание

  return result;
}

async function consumeTasks() {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(config.taskQueue);
    await channel.assertQueue(config.resultQueue);

    channel.consume(config.taskQueue, async (msg) => {
      const task = JSON.parse(msg.content.toString());
      const result = await processTask(task);

      await channel.sendToQueue(config.resultQueue, Buffer.from(JSON.stringify(result)));
      channel.ack(msg);
    });

    console.log('M2 microservice waiting for tasks...');
  } catch (error) {
    console.error('Error while consuming tasks:', error);
  }
}

consumeTasks();