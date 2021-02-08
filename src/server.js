import { Server, Model } from "miragejs"

export function makeServer({ environment = "development" } = {}) {
  let server = new Server({
    environment,

    models: {
      user: Model,
    },

    seeds(server) {
      server.create("user", { firstName: "John", lastName: "Doe", email: "john.doe@gmail.com", dob: "1595493738" })
    },

    routes() {
      this.namespace = "api"

      this.get("/users", schema => {
        return schema.users.all()
      })

      this.get("/users/search/:term", (schema, request) => {
        const term = request.params.term;

        return schema.users.where({firstName: term})
      })

      this.post("/users", (schema, request) => {
        let attrs = JSON.parse(request.requestBody)

        return schema.users.create(attrs)
      })

      this.delete("/users/:id", (schema, request) => {
        const id = request.params.id;

        return schema.users.find(id).destroy();
      });

      this.patch("/users/:id", (schema, request) => {
        let newAttrs = JSON.parse(request.requestBody)
        let id = request.params.id
        let user = schema.users.find(id)
      
        return user.update(newAttrs)
      })

    },
  })

  return server
}