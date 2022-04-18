const mongoose = require("mongoose");
const request = require("supertest");
const { Seller } = require("../../../model/seller");
const { User } = require("../../../model/user");

let server;

describe("/api/seller", () => {
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await Seller.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
    it("should return all sellers", async () => {
      try {
        await Seller.collection.insertMany([
          { name: "aaa", address: "aaa", zip: 1001, city: "aaa" },
          { name: "bbb", address: "bbb", zip: 1001, city: "bbb" },
        ]);
      } catch (e) {
        console.log(e);
      }
      const res = await request(server).get("/api/seller");
      expect(res.status).toBe(200);
      expect(res.body.some((f) => f.name === "aaa")).toBeTruthy();
    });
  });
});

describe("GET /:id", () => {
  it("should return the seller with the given id", async () => {
    const seller = new Seller({
      name: "aaa",
      address: "aaa",
      zip: 1001,
      city: "aaa",
    });
    seller.save();

    const res = await request(server).get("/api/seller/" + seller._id);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", seller.name);
  });

  it("should return 404 when given an invalid seller ID", async () => {
    const res = await request(server).get("/api/seller/1");
    expect(res.status).toBe(404);
  });

  it("should return 404 when given an invalid but nonexisting seller ID", async () => {
    const res = await request(server).get(
      "/api/seller/" + new mongoose.Types.ObjectId()
    );
    expect(res.status).toBe(404);
  });
});

describe("POST /", () => {
  let token;
  let seller;

  beforeEach(() => {
    token = new User().generateAuthToken();
    seller = {
      name: "aaa",
      address: "aaa",
      zip: 1001,
      city: "aaa",
    };
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return 401 if the user is not logged in", async () => {
    token = "";
    const res = await request(server).post("/api/seller").send(seller);
    expect(res.status).toBe(401);
  });

  it("should return 400 if name is less than 3 characters", async () => {
    seller.name = "a";
    const res = await request(server)
      .post("/api/seller")
      .set("x-auth-token", token)
      .send(seller);
    expect(res.status).toBe(400);
  });

  if (
    ("should return 400 if name is more than 255",
    async () => {
      seller.name = new Array(256).join("a");
      // todo rest
    })
  );

  if (
    ("should save and return seller if valid",
    async () => {
      const res = await request(server)
        .post("/api/seller")
        .set("x-auth-token", token)
        .send(seller);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", seller.name);

      const resultat = Seller.find({ _id: seller._id });
      expect(resultat).not.toBeNull();
    })
  );
});
