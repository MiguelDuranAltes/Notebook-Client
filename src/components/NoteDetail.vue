<template>
  <div class="note-detail-container">
    <h1 class="note-detail-title">Detalle de una nota</h1>

    <!-- Si no hacemos esto, la código intentará acceder al .content de note, que en un principio es null, 
    hasta que el componente no se haya montado en el DOM -->
    <div v-if="note" class="note-card">
      <div class="note-item">
        <span class="note-label">Título:</span>
        <span class="note-value">{{ note.title }}</span>
      </div>
      <div class="note-item">
        <span class="note-label">Contenido:</span>
        <span class="note-value">{{ note.content }}</span>
      </div>
      <div class="note-item" v-if="isAdmin">
        <span class="note-label">Usuario:</span>
        <span class="note-value">{{ note.owner }}</span>
      </div>
      <!-- Para acceder en las categorías al .name note.categories.map((c) => c.name), esto está en NoteCard -->
      <div class="note-item">
        <span class="note-label">Categorías:</span>
        <span class="note-value">{{ note.categories.map((c) => c.name).join(", ") }}</span>
      </div>
      <div class="note-item">
        <span class="note-label">Fecha de creación:</span>
        <span class="note-value">{{ note.timestamp.toLocaleString() }}</span>
      </div>
      <div class="note-item">
        <span class="note-label">Archivado:</span>
        <input
          type="checkbox"
          v-model="note.archived"
          disabled
          v-if="isAdmin"
          class="archived-checkbox"
        />
        <!-- Checkbox editable si no es admin -->
        <input
          type="checkbox"
          v-model="note.archived"
          @change="alternarArchivado"
          v-if="!isAdmin"
          class="archived-checkbox"
        />
      </div>
      <div class="card-footer d-flex justify-content-between">
        <router-link
          :to="{ name: 'NoteEdit', params: { noteId: note.id } }"
          class="btn btn-outline-secondary"
        >
          Editar Nota
        </router-link>

        <button class="btn btn-outline-danger" @click="intentarBorrarNota">
          <img src="/trash3-fill.svg" alt="Eliminar nota" style="width: 16px; height: 16px" />
        </button>

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
    </div>

    <div v-else>Cargando nota...</div>
  </div>
</template>

<script>
import NoteRepository from "../repositories/NoteRepository.js";
import auth from "@/common/auth.js";

export default {
  data() {
    return {
      note: null,
      isAdmin: auth.isAdmin(),
      delete_intention: false
    };
  },
  async mounted() {
    // Carga la nota según el ID de la ruta
    this.note = await NoteRepository.findOne(this.$route.params.noteId);
  },
  methods: {
    // Método para alternar el estado de "archivado" de la nota
    async alternarArchivado() {
      try {
        await NoteRepository.save(this.note);
      } catch (err) {
        console.error(err);
      }
    },
    intentarBorrarNota() {
      this.delete_intention = true;
    },
    cancelarBorrarNota() {
      this.delete_intention = false;
    },
    async borrarNota() {
      try {
        await NoteRepository.delete(this.note.id);
        this.$router.push("/");
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>
.note-detail-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.note-detail-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.note-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.note-item {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-label {
  font-weight: bold;
  color: #555;
}

.note-value {
  color: #333;
  flex-grow: 1;
  text-align: right;
  word-wrap: break-word; /* Permitir que el contenido largo se ajuste en varias líneas */
  word-break: break-word; /* Asegura que las palabras largas también se dividan correctamente */
  white-space: pre-wrap; /* Respeta los saltos de línea en el contenido */
}

.archived-checkbox {
  margin-left: 10px;
}

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
