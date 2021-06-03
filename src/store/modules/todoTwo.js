export const todoTwo = {
  namespaced: true,

  state() {
    return {
      todos: [],
      isLoading: false,
      error: "",
    };
  },
  mutations: {
    setTodosData(state, data) {
      state.todos = data;
    },
    setIsLoading(state, boolean) {
      state.isLoading = boolean;
    },
    setError(state, err) {
      state.error = err;
    },
  },
  actions: {
    // This first action is the core of all workflows and updates the store.state every time there has been a change
    async fetchTodo(ctx) {
      ctx.commit("setIsLoading", true);
      ctx.commit("setError", "");
      try {
        const res = await fetch("https://dev-test-api-two.herokuapp.com/todos");
        if (res.status !== 200) {
          throw new Error("Unable to fetch data");
        }
        const data = await res.json();
        ctx.commit("setTodosData", data);
        ctx.commit("setIsLoading", false);
      } catch (err) {
        console.log(err.message);
        ctx.commit("setError", "Unable to fetch todo's list");
        ctx.commit("setIsLoading", false);
      }
    },
    async fetchSingleTodo(ctx, todo) {
      try {
        const res = await fetch(
          "https://dev-test-api-two.herokuapp.com/todos/" + todo.id
        );
        if (res.status !== 200) {
          throw new Error("Unable to fetch data");
        }
        const data = await res.json();
        const newArr = ctx.state.todos.map((todo) => {
          if (todo.id == data.id) {
            return data;
          }
          return todo;
        });
        ctx.commit("setTodosData", newArr);
      } catch (err) {
        console.log(err.message);
        ctx.commit("setError", "Unable to access the data base at this time");
      }
    },
    async toggleComplete(ctx, todo) {
      try {
        await fetch("https://dev-test-api-two.herokuapp.com/todos/" + todo.id, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ complete: !todo.complete }),
        });
        await ctx.dispatch("fetchSingleTodo", todo);
      } catch (err) {
        console.log(err.message);
      }
    },
    async addTodo(ctx, newTodo) {
      try {
        await fetch("https://dev-test-api-two.herokuapp.com/todos", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(newTodo),
        });
        await ctx.dispatch("fetchTodo");
      } catch (err) {
        console.log(err.message);
      }
    },
    async deleteTodo(ctx, todo) {
      try {
        await fetch("https://dev-test-api-two.herokuapp.com/todos/" + todo.id, {
          method: "delete",
        });
        await ctx.dispatch("fetchTodo");
      } catch (err) {
        console.log(err.message);
      }
    },
    async updateTodo(ctx, todo) {
      try {
        await fetch("https://dev-test-api-two.herokuapp.com/todos/" + todo.id, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ update: !todo.update }),
        });
        await ctx.dispatch("fetchTodo");
      } catch (err) {
        console.log(err.message);
      }
    },
    async updateTodoText(ctx, todo, text) {
      try {
        await fetch("https://dev-test-api-two.herokuapp.com/todos/" + todo.id, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            update: !todo.update,
            text: todo.text,
            complete: false,
          }),
        });
        await ctx.dispatch("fetchTodo");
      } catch (err) {
        console.log(err.message);
      }
    },
  },
  getters: {},
};
