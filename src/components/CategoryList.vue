<template>
  <div class="container">
    <div class="float-end">
      <router-link class="btn btn-primary" :to="{ name: 'CategoryCreate' }">
        Crear nueva categoría
      </router-link>
    </div>
    <h1>Lista de categorías</h1>
    <div class="card-container">
      <!-- Contenedor para centrar las cards -->
      <div v-for="category in categories" :key="category.id" class="card" style="width: 18rem">
        <div class="card-body">
          <div class="card-text">
            <router-link class="card-link" :to="'/categories/' + category.id">
              {{ category.name }}
            </router-link>
          </div>

          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-outline-danger" @click="intentarBorrarCategoria(category.id)">
              <img
                src="/trash3-fill.svg"
                alt="Eliminar categoría"
                style="width: 16px; height: 16px"
              />
            </button>
            <router-link
              class="btn btn-outline-info d-flex align-items-center justify-content-center"
              :to="{ name: 'CategoryEdit', params: { categoryId: category.id } }"
              alt="Editar Categoría"
              style="height: 36px"
            >
              <img
                src="/journal-text.svg"
                alt="Editar Categoría"
                style="width: 16px; height: 16px"
              />
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Popup para confirmar eliminación -->
    <div v-if="deleteIntention" class="modal-overlay">
      <div class="modal-container">
        <h1>¿Estás seguro de que quieres borrar la categoría?</h1>
        <div class="card-footer d-flex justify-content-between">
          <button type="button" class="btn btn-outline-danger" @click="borrarCategoria">
            Estoy seguro
          </button>
          <button type="button" class="btn btn-outline-secondary" @click="cancelarBorrarCategoria">
            Cancelar operación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryRepository from "@/repositories/CategoryRepository";

export default {
  data() {
    return {
      categories: null,
      deleteIntention: false,
      categoria_a_borrar: null
    };
  },
  async mounted() {
    this.categories = await CategoryRepository.findAll();
  },
  methods: {
    intentarBorrarCategoria(categoryId) {
      this.deleteIntention = true;
      this.categoria_a_borrar = categoryId;
    },
    cancelarBorrarCategoria() {
      this.deleteIntention = false;
      this.categoria_a_borrar = null;
    },
    async borrarCategoria() {
      try {
        await CategoryRepository.delete(this.categoria_a_borrar);
        this.categories = this.categories.filter(
          (category) => category.id !== this.categoria_a_borrar
        ); // Actualiza la lista
        this.cancelarBorrarCategoria();
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra el contenido en el eje horizontal */
}

.card-container {
  display: flex;
  flex-wrap: wrap; /* Permite que las cards se alineen en múltiples filas */
  justify-content: center; /* Centra las cards en el contenedor */
}

.card {
  margin: 10px; /* Espaciado entre cards */
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Asegura que esté por encima de otros elementos */
}

.modal-container {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>
