"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/e-commerce";

const TestSchema = new mongoose.Schema({ name: String });
const TestModel = mongoose.model("Test", TestSchema);

describe("Mongoose connection", () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await connection.disconnection();
  });

  it("should connect to mongoose", async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("should save a document to the database", async () => {
    const user = await Test({ name: "Nam Nguyen" });
    await user.save();
    expect(user.isNew).toBe(false);
  });

  it("should find a document to the database", async () => {
    const user = await Test.findOne({ name: "Nam Nguyen" });
    expect(user).toBeDefined();
    expect(user.name).toBe("Nam Nguyen");
  });
});
