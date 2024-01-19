import request from "supertest";
import { app } from "../../app";

it("thow en 400 error if no permission name is supplied", async () => {
  await request(app).post("/api/users/permission/create").send({}).expect(400);
});

it("thow en 400 error if no permission name is only supplied", async () => {
  await request(app)
    .post("/api/users/permission/create")
    .send({ name: "list_clients" })
    .expect(400);
});

it("creat permission if all attrs is supplied", async () => {
  await request(app)
    .post("/api/users/permission/create")
    .send({
      name: "list_clients",
      cat: "sales",
      guard_name: "sales",
      role: "sales executive",
    })
    .expect(200);
});

it("throw error if create permission with same name and category", async () => {
  await request(app)
    .post("/api/users/permission/create")
    .send({
      name: "list_clients",
      cat: "sales",
      guard_name: "sales",
      role: "sales executive",
    })
    .expect(200);

  await request(app)
    .post("/api/users/permission/create")
    .send({
      name: "list_clients",
      cat: "sales",
      guard_name: "sales",
      role: "sales executive",
    })
    .expect(400);
});

it("will create permission and will list attributes, users_id, name, cat, etc", async () => {
  const response = await request(app)
    .post("/api/users/permission/create")
    .send({
      name: "list_clients",
      cat: "sales",
      guard_name: "sales",
      role: "sales executive",
    })
    .expect(200);

  let data = JSON.parse(response.text);

  expect(data.permission.id).toBeDefined();
  expect(data.permission.cat).toBeDefined();
  expect(data.permission.name).toBeDefined();
  expect(data.permission.guard_name).toBeDefined();
});
