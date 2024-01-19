const amqp = require("amqplib");

const message = "Hello World!";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "e-commerce";
    await channel.assertQueue(queueName, { durable: true });
    
    await channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`[x] Sent ${message}`);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
