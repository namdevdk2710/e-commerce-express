const amqp = require("amqplib");

const runConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "e-commerce";
    await channel.assertQueue(queueName, { durable: true });

    await channel.consume(
      queueName,
      (message) => {
        console.log(`Received ${message.content.toString()}`);
      },
      { noAck: true }
    );
  } catch (error) {
    console.error(error);
  }
};

runConsumer().catch(console.error);
