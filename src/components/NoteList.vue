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
    <h1>Lista de notas</h1>
    <h6>Número total de notas: {{ filteredNotes.length }}</h6>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col mb-3" v-for="note in filteredNotes" :key="note.id">
        <!-- poniendo el :note pasamos el objeto, si no ponemos el : antes de note estaríamos pasando el string note -->
        <NoteCard
          :note="note"
          :users="this.users"
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
import UserRepository from "@/repositories/UserRepository";
import NoteRepository from "../repositories/NoteRepository";
import NoteCard from "./NoteCard.vue";
import auth from "@/common/auth";

export default {
  data() {
    return {
      notes: [],
      delete_intention: false,
      noteId: null,
      showArchived: auth.isAdmin(),
      isAdmin: auth.isAdmin(),
      users: null
    };
  },
  computed: {
    filteredNotes() {
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
  async mounted() {
    this.notes = await NoteRepository.findAll();
    /* Solo el admin puede cargar la lista de usuarios, por lo tanto tendré que inicializar users a null para que 
    cuando soy usuario se pase un null a NoteCard y me sirva en el div-if
     */
    if (this.isAdmin) this.users = await UserRepository.findAll();
  },
  methods: {
    actualizarArchivado(noteId, nuevoValor) {
      // Encontrar la nota en la lista y actualizar su propiedad `archived`
      // Probar si sobra esta línea de código, puede ser que solo tenga que refrescar la página
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
        this.cancelarBorrarNota();
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
