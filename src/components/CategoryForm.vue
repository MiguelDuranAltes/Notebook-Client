<template>
  <div class="container category-form">
    <h1>{{ newCategory ? "Crear Categoria" : "Editar Categoría" }}</h1>
    <form>
      <div class="mb-3">
        <label for="name" class="form-label"> Nombre </label>
        <input type="text" class="form-control" id="name" v-model="category.name" />
      </div>
      <button class="btn btn-primary" @click.prevent="guardarCategoria">Guardar</button>
    </form>
    <!-- Mostrar mensaje de error si existe -->
    <div v-if="errorMessage" style="color: red; margin-top: 10px; font-size: 14px">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import CategoryRepository from "@/repositories/CategoryRepository";

export default {
  data() {
    return {
      category: {
        id: null,
        name: null
      },
      newCategory: true,
      errorMessage: null,
      categories: []
    };
  },
  async mounted() {
    if (this.$route.params.categoryId) {
      this.newCategory = false;
      /* Ojo con el await, si me olvido de él, no me va a recuperar la categoría */
      this.category = await CategoryRepository.findOne(this.$route.params.categoryId);
    }
    this.categories = await CategoryRepository.findAll();
  },
  methods: {
    async guardarCategoria() {
      this.errorMessage = null;
      if (this.category.name == null || this.category.name.length == 0) {
        this.errorMessage = "Introduce al menos algún caracter";
        return;
      }
      if (this.categoryExists(this.category.name)) {
        this.errorMessage = "Ya existe una categoría con ese nombre";
        return;
      }
      try {
        await CategoryRepository.save(this.category);
        this.$router.push("/categories");
      } catch (err) {
        console.log(err);
      }
    },
    categoryExists(name) {
      return this.categories.some((category) => category.name === name);
    }
  }
};
</script>

<style coped>
.category-form {
  margin-top: 20px;
  max-width: 600px;
  margin: auto;
}
.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}
</style>
