<template>
  <!-- por defecto en un form se hace un post, click.prevent para evitar que se haga automáticamente el post del form -->
  <div class="container note-form">
    <h1>{{ newNote ? "Crear Nota" : "Editar Nota" }}</h1>
    <form>
      <div class="mb-3">
        <label for="title" class="form-label">Título</label>
        <textarea
          type="text"
          class="form-control"
          id="title"
          v-model="note.title"
          maxlength="300"
        />
      </div>
      <div class="mb-3">
        <label for="content" class="form-label">Contenido</label>
        <textarea id="content" class="form-control" rows="3" v-model="note.content"></textarea>
      </div>

      <!-- Checkbox solo visible si no es una nueva nota -->
      <div v-if="!newNote">
        <label for="archived" class="form-label">Archivada</label>
        <input type="checkbox" id="archived" v-model="note.archived" />
      </div>

      <!-- Checkbox para categorías con estilo personalizado -->
      <div class="mb-3">
        <label>Categorías:</label>
        <div class="category-container">
          <div v-for="categoria in categorias" :key="categoria.id" class="category-item">
            <input
              type="checkbox"
              :value="categoria.id"
              v-model="note.categories"
              class="category-checkbox"
            />
            <span class="category-name">{{ categoria.name }}</span>
          </div>
        </div>
      </div>

      <button class="btn btn-primary" @click.prevent="guardarNota">Guardar</button>
    </form>

    <!-- Mostrar mensaje de error si existe -->
    <div v-if="errorMessage" style="color: red; margin-top: 10px; font-size: 14px">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import CategoryRepository from "@/repositories/CategoryRepository";
import NoteRepository from "@/repositories/NoteRepository";

export default {
  data() {
    return {
      note: {
        categories: [] // Inicializar como array vacío para que en el v-model de arriba sepa que es un array y no lo trate como un objeto cualquiera
      },
      newNote: true, // Bandera para identificar si estamos creando o editando una nota
      categorias: [], // Lista de todas las categorías disponibles
      errorMessage: null // Variable para manejar los mensajes de error
    };
  },
  async mounted() {
    // Si estamos editando una nota (existe un noteId), cargamos los datos de la nota
    if (this.$route.params.noteId) {
      this.newNote = false;
      const noteData = await NoteRepository.findOne(this.$route.params.noteId);

      //tengo que tener solo ids en categories porque en el v-model necesito un array de ids para hacer el vínculo bidireccional
      //en la nota tengo un array de objetos categories, tengo que quedarme solo con los id
      this.note = {
        ...noteData,
        categories: noteData.categories.map((categoria) => categoria.id) // Aquí solo guardamos los IDs
      };
    }
    // Cargar las categorías disponibles
    this.categorias = await CategoryRepository.findAll();
  },
  methods: {
    async guardarNota() {
      // Limpiar el mensaje de error antes de intentar guardar
      this.errorMessage = null;

      // Validaciones para el título y el contenido
      if (!this.note.title && !this.note.content) {
        this.errorMessage = "La nota debe incluir al menos título o contenido";
        return;
      } else if (this.note.title && this.note.title.length > 300) {
        this.errorMessage = "El título de la nota no puede superar los 300 caracteres";
        return;
      }

      // Convertir las categorías seleccionadas en objetos CategoryDTO
      this.note.categories = this.categorias.filter((categoria) =>
        this.note.categories.includes(categoria.id)
      );

      try {
        // Guardar la nota utilizando el repositorio
        const respuesta = await NoteRepository.save(this.note);
        // Redirigir a la página de detalles de la nota después de guardar
        this.$router.push({ name: "NoteDetail", params: { noteId: respuesta.id } });
      } catch (e) {
        console.error(e);
        // Manejar el error de guardado
        if (e.response?.data?.message) {
          this.errorMessage = e.response.data.message;
        } else {
          this.errorMessage = "Ocurrió un error, por favor intenta de nuevo.";
        }
      }
    }
  }
};
</script>

<style scoped>
.note-form {
  margin-top: 20px;
  max-width: 600px;
  margin: auto;
}

.category-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.category-item {
  display: flex;
  align-items: center;
}

.category-checkbox {
  margin-right: 5px;
}

.category-name {
  font-size: 14px;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}
</style>
