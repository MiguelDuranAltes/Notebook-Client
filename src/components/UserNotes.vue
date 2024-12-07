<template>
  <div class="container">
    <h1 v-if="this.user">Lista de notas de {{ this.user.login }}</h1>
    <h6 v-if="user">Número total de notas: {{ notes.length }}</h6>

    <div
      v-if="this.user && this.user.active"
      class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4"
    >
      <div class="col mb-3" v-for="note in notes" :key="note.id">
        <!-- poniendo el :note pasamos el objeto, si no ponemos el : antes de note estaríamos pasando el string note -->
        <NoteCard
          :note="note"
          @update:archived="actualizarArchivado(note.id, $event)"
          @update:delete="intentarBorrarNota(note.id)"
        >
        </NoteCard>
      </div>
    </div>
  </div>
</template>

<script>
import NoteCard from "./NoteCard.vue";
import UserRepository from "@/repositories/UserRepository";

export default {
  data() {
    return {
      notes: [],
      users: [],
      user: null
    };
  },
  components: { NoteCard },
  async mounted() {
    this.users = await UserRepository.findAll();
    /* Comprobando que los datos que tengo son correctos
    console.log(this.users)
    console.log('este es mi id:', this.$route.params.userId)
    Ojo en esta comparación, user.id es un int y el route es un string */
    this.user = this.users.find((user) => user.id === parseInt(this.$route.params.userId));

    if (this.user && this.user.active) {
      this.notes = await UserRepository.findOne(this.$route.params.userId);
      this.notes = this.notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  }
};
</script>
