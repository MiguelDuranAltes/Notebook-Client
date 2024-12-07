<template>
  <div class="container">
    <h1>Lista de usuarios</h1>
    <div class="card-container">
      <div v-for="user in this.users" :key="user.id" class="card" style="width: 18rem">
        <div class="card-body">
          <div class="card-text">
            <router-link class="card-link" :to="'/users/' + user.id">
              {{ user.login }}
            </router-link>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-outline-danger" @click="intentarBorrarUsuario(user.id)">
              <img
                src="/trash3-fill.svg"
                alt="Eliminar usuario"
                style="width: 16px; height: 16px"
              />
            </button>
            <button v-if="user.active" class="btn btn-outline-info" @click="cambiarActive(user)">
              <img
                src="/file-minus-fill.svg"
                alt="Desactivar usuario"
                style="width: 16px; height: 16px"
              />
            </button>
            <button v-if="!user.active" class="btn btn-outline-info" @click="cambiarActive(user)">
              <img src="/file-plus.svg" alt="Activar usuario" style="width: 16px; height: 16px" />
            </button>
          </div>
        </div>
      </div>
      <!-- Popup para confirmar eliminación -->
      <div v-if="deleteIntention" class="modal-overlay">
        <div class="modal-container">
          <h1>¿Estás seguro de que quieres borrar el usuario?</h1>
          <div class="card-footer d-flex justify-content-between">
            <button type="button" class="btn btn-outline-danger" @click="borrarUsuario">
              Estoy seguro
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="cancelarBorrarUsuario">
              Cancelar operación
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="errorMessage" style="color: red; margin-top: 10px; font-size: 14px">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import UserRepository from "@/repositories/UserRepository";
import { getStore } from "@/common/store";

export default {
  data() {
    return {
      users: null,
      deleteIntention: false,
      userId: null,
      errorMessage: null
    };
  },
  async mounted() {
    this.users = await UserRepository.findAll();
  },
  methods: {
    intentarBorrarUsuario(id) {
      this.userId = id;
      this.deleteIntention = true;
    },
    cancelarBorrarUsuario() {
      this.userId = null;
      this.deleteIntention = false;
    },
    async borrarUsuario() {
      try {
        //si falla el servidor es porque le estoy pasando un dato incorrecto, aquí estaba pasando el login en vez del id
        await UserRepository.delete(this.userId);
        this.cancelarBorrarUsuario();
        this.loadUserList();
      } catch (err) {
        console.log(err);
      }
    },
    async cambiarActive(user) {
      if (user.login === getStore().state.user.login) {
        this.errorMessage = "No se puede desactivar a uno mismo";
        return;
      }
      try {
        this.errorMessage = null;
        user.active = !user.active;
        if (user.active) await UserRepository.activate(user.id);
        else await UserRepository.deactivate(user.id);
        this.loadUserList();
      } catch (err) {
        console.log(err);
      }
    },
    async loadUserList() {
      this.users = await UserRepository.findAll();
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
