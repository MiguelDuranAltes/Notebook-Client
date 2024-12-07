<template>
  <div class="card" style="width: 18rem">
    <div class="card-body">
      <h6 class="card-subtitle mb-2 text-muted">
        <!--<router-link class="card-link" :to="'/user/' + note.owner">
          {{ note.owner }}
        </router-link>
      -->
        <div v-if="isAdmin && users" class="card-text">
          <router-link class="card-link" :to="'/users/' + getUserIdByLogin(note.owner)">
            {{ note.owner }}
          </router-link>
        </div>
      </h6>
      <p class="card-text">
        {{ note.title }}
      </p>
      <p class="card-text">
        {{ note.content }}
      </p>
      <p class="card-text">
        <router-link class="card-link" :to="'/notes/' + note.id">
          {{ note.timestamp.toLocaleDateString() }} -
          {{ note.timestamp.toLocaleTimeString() }}
        </router-link>
      </p>
      <h6 class="card-subtitle mb-2 text-muted">
        <!-- Iterar sobre las categorías de la nota -->
        <span v-for="category in note.categories" :key="category.id">
          <router-link class="card-link" :to="'/categories/' + category.id">
            {{ category.name }}
          </router-link>
          <!-- Añadir coma entre categorías excepto la última -->
          <span
            v-if="
              note.categories.length > 1 && category !== note.categories[note.categories.length - 1]
            "
            >,
          </span>
        </span>
      </h6>

      <div class="card-footer d-flex justify-content-between">
        <button
          v-if="!note.archived"
          class="btn btn-outline-secondary"
          :disabled="isAdmin"
          @click="alternarArchivado"
        >
          <img src="/archive.svg" alt="Archivar nota" style="width: 16px; height: 16px" />
        </button>
        <button
          v-if="note.archived"
          class="btn btn-outline-secondary"
          :disabled="isAdmin"
          @click="alternarArchivado"
        >
          <img src="/archive-fill.svg" alt="Desarchivar nota" style="width: 16px; height: 16px" />
        </button>
        <button v-if="!isAdmin" class="btn btn-outline-danger" @click="borrarNota">
          <img src="/trash3-fill.svg" alt="Eliminar nota" style="width: 16px; height: 16px" />
        </button>
        <!-- Estas clases de Bootstrap permiten que el botón y el icono se alineen correctamente-->
        <router-link
          v-if="!isAdmin"
          class="btn btn-outline-info d-flex align-items-center justify-content-center"
          :to="{ name: 'NoteEdit', params: { noteId: note.id } }"
          alt="Detalles de la nota"
          style="height: 36px"
        >
          <img
            src="/journal-text.svg"
            alt="Detalles de la nota"
            style="width: 16px; height: 16px"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/common/auth.js";
import NoteRepository from "@/repositories/NoteRepository";

export default {
  data() {
    return {
      isAdmin: auth.isAdmin()
    };
  },
  props: {
    note: {
      type: Object,
      required: true
    },
    //lista de usuarios que recibo para poder enlazar login con id
    users: {
      type: Array,
      required: false
    },
    showDetailsButton: {
      type: Boolean,
      default: true
    }
  },
  /* método para que se me muestren las categorías separadas por comas */
  /*computed: {
    categoriesAsString() {
      return this.note?.categories.map((t) => t.name).join(", ");
    }
  },*/
  methods: {
    async alternarArchivado() {
      // Emitir el valor opuesto de `note.archived` al componente padre
      const newNote = {
        ...this.note,
        archived: !this.note.archived
      };
      try {
        await NoteRepository.save(newNote);
        this.$emit("update:archived", newNote.archived);
      } catch (err) {
        console.error(err);
      }
    },
    async borrarNota() {
      this.$emit("update:delete");
    },
    getUserIdByLogin(login) {
      const user = this.users.find((user) => user.login === login);
      return user ? user.id : null; // Retorna el id o null si no se encuentra
    }
  }
};
</script>

<style scoped>
h6::after {
  content: "\00a0 ";
}

button:disabled {
  opacity: 0.6; /* Hacerlo más transparente */
  cursor: not-allowed; /* Cambiar el cursor a 'no permitido' */
}
</style>
