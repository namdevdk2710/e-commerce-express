"use strict";

const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    if (!connection) throw new Error("No connection to RabbitMQ");

    const channel = await connection.createChannel();

    return { channel, connection };
  } catch (error) {}
};

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    const queue = "e-commerce";
    const message = "Hello World!";
    await channel.assertQueue(queue, { durable: true });
    await channel.sendToQueue(queue, Buffer.from(message));

    await connection.close();
  } catch (error) {
    console.error(`Error connecting to RabbitMQ: ${error.message}`);
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages...`);
    channel.consume(
      queueName,
      (message) => {
        console.log(
          `Received message ${queueName}:`,
          message.content.toString()
        );
      },
      { noAck: true }
    );
  } catch (error) {
    console.error("Error consuming queue: ", error.message);
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
  consumerQueue,
};
