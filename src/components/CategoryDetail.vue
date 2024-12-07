<template>
  <div class="container">
    <div v-if="!isAdmin" class="float-end">
      <router-link class="btn btn-primary" :to="{ name: 'NoteCreate' }">
        Crear nueva nota
      </router-link>
    </div>
    <div v-if="!isAdmin" class="float-start">
      <button v-if="showArchived" class="btn btn-primary" @click="changeArchived">
        Ocultar archivados
      </button>
      <button v-if="!showArchived" class="btn btn-primary" @click="changeArchived">
        Mostrar archivados
      </button>
    </div>
    <h1 v-if="category">Lista de notas de la categoría {{ category.name }}</h1>
    <h6>Número total de notas: {{ filteredNotes.length }}</h6>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col mb-3" v-for="note in filteredNotes" :key="note.id">
        <NoteCard
          :note="note"
          :users="users"
          @update:archived="actualizarArchivado(note.id, $event)"
          @update:delete="intentarBorrarNota(note.id)"
        >
        </NoteCard>
      </div>
    </div>
    <div v-if="delete_intention" class="modal-overlay">
      <div class="modal-container">
        <h1>¿Estás seguro de que quieres borrar la nota?</h1>
        <div class="card-footer d-flex justify-content-between">
          <button type="button" class="btn btn-outline-danger" @click="borrarNota">
            Estoy seguro
          </button>
          <button type="button" class="btn btn-outline-secondary" @click="cancelarBorrarNota">
            Cancelar operación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/common/auth";
import NoteRepository from "../repositories/NoteRepository";
import NoteCard from "./NoteCard.vue";
import UserRepository from "@/repositories/UserRepository";
import CategoryRepository from "@/repositories/CategoryRepository";

export default {
  data() {
    return {
      notes: [],
      delete_intention: false,
      noteId: null,
      showArchived: auth.isAdmin(),
      categoryId: null,
      isAdmin: auth.isAdmin(),
      users: null,
      category: null
    };
  },
  computed: {
    filteredNotes() {
      //Interesante usar el debugger aquí, cargo todas las notas al principio porque users está a nulo
      // Solo filtrar si soy admin y tengo la lista de usuarios disponible
      if (this.isAdmin && this.users) {
        return this.notes
          .filter((note) => {
            // Buscar el usuario por su login y verificar si está activo
            const user = this.users.find((user) => user.login === note.owner);
            // Si el usuario no existe o no está activo, la nota no se muestra
            if (!user || !user.active) return false;
            // Mostrar la nota solo si no está archivada o si showArchived está activo
            return this.showArchived || !note.archived;
          })
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }

      // Retorna las notas filtradas según el valor de `showArchived`
      return this.notes
        .filter((note) => this.showArchived || !note.archived)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  },
  components: { NoteCard },
  watch: {
    "$route.params.categoryId": {
      handler(newCategoryId) {
        this.categoryId = newCategoryId;
        this.fetchNotesByCategory();
        this.findCategory();
      },
      //el immediate me dice si el watcher debe de ser ejecutado nada más montar el componente o esperar a cambiar la categoryId
      //por lo tanto en est caso puedo prescindir del mounted ya el watcher está haciendo su misma función
      immediate: true
    }
  },
  methods: {
    async fetchNotesByCategory() {
      this.notes = await NoteRepository.findAll();
      // Si es admin, cargar la lista de usuarios
      if (this.isAdmin) this.users = await UserRepository.findAll();

      // Filtrar notas que tengan al menos una categoría con el categoryId actual
      // Si le añado un parametro al findAll(category), me devolverá todas las listas de esa categoría

      this.notes = this.notes.filter((note) =>
        note.categories.some((category) => category.id === parseInt(this.categoryId))
      );
    },
    async findCategory() {
      this.category = await CategoryRepository.findOne(this.categoryId);
    },
    actualizarArchivado(noteId, nuevoValor) {
      // Encontrar la nota en la lista y actualizar su propiedad `archived`
      const note = this.notes.find((n) => n.id === noteId);
      if (note) {
        note.archived = nuevoValor;
      }
    },
    intentarBorrarNota(noteId) {
      this.delete_intention = true;
      this.noteId = noteId;
    },
    cancelarBorrarNota() {
      this.delete_intention = false;
      this.noteId = null;
    },
    async borrarNota() {
      try {
        await NoteRepository.delete(this.noteId);
        // Actualizar la lista de notas eliminando la nota del array
        this.notes = this.notes.filter((note) => note.id !== this.noteId);
        this.noteId = null;
        this.delete_intention = false;
      } catch (err) {
        console.error(err);
      }
    },
    changeArchived() {
      this.showArchived = !this.showArchived;
    }
  }
};
</script>

<style scoped>
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
