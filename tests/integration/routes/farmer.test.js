const mongoose = require("mongoose");
const request = require("supertest");
const { Farmer } = require("../../../model/farmer");
const { User } = require("../../../model/user");

let server;

describe("/api/farmer", () => {
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await Farmer.deleteMany({});
    await server.close();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /", () => {
    it("should return all farmers", async () => {
      try {
        await Farmer.collection.insertMany([
          { name: "aaa", address: "aaa", zip: 1001, city: "aaa" },
          { name: "bbb", address: "bbb", zip: 1001, city: "bbb" },
        ]);
      } catch (e) {
        console.log(e);
      }
      const res = await request(server).get("/api/farmer");
      expect(res.status).toBe(200);
      expect(res.body.some((f) => f.name === "aaa")).toBeTruthy();
    });
  });
});

describe("GET /:id", () => {
  it("should return the farmer with the given id", async () => {
    const farmer = new Farmer({
      name: "aaa",
      address: "aaa",
      zip: 1001,
      city: "aaa",
    });
    farmer.save();

    const res = await request(server).get("/api/farmer/" + farmer._id);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", farmer.name);
  });

  it("should return 404 when given an invalid farmer ID", async () => {
    const res = await request(server).get("/api/farmer/1");
    expect(res.status).toBe(404);
  });

  it("should return 404 when given an invalid but nonexisting farmer ID", async () => {
    const res = await request(server).get(
      "/api/farmer/" + new mongoose.Types.ObjectId()
    );
    expect(res.status).toBe(404);
  });
});

describe("POST /", () => {
  let token;
  let farmer;

  beforeEach(() => {
    token = new User().generateAuthToken();
    farmer = {
      name: "aaa",
      address: "aaa",
      zip: 1001,
      city: "aaa",
    };
  });

  it("should return 401 if the user is not logged in", async () => {
    token = "";
    const res = await request(server).post("/api/farmer").send(farmer);
    expect(res.status).toBe(401);
  });

  it("should return 400 if name is less than 3 characters", async () => {
    farmer.name = "a";
    const res = await request(server)
      .post("/api/farmer")
      .set("x-auth-token", token)
      .send(farmer);
    expect(res.status).toBe(400);
  });

  if (
    ("should return 400 if name is more than 255",
    async () => {
      farmer.name = new Array(256).join("a");
      // todo rest
    })
  );

  if (
    ("should save and return farmer if valid",
    async () => {
      const res = await request(server)
        .post("/api/farmer")
        .set("x-auth-token", token)
        .send(farmer);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", farmer.name);

      const resultat = Farmer.find({ _id: farmer._id });
      expect(resultat).not.toBeNull();
    })
  );
});
