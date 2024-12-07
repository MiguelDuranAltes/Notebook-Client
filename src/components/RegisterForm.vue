<template>
  <button class="back-button" @click="volverAtras">
    <img src="/back_arrow.png" alt="Volver" class="arrow-icon" />
  </button>
  <div class="register-container">
    <div class="form-box">
      <h2 class="register-title">Register</h2>
      <form class="register-form">
        <div class="input-group mb-3 mt-3">
          <label for="login" class="form-label">Login:</label>
          <input
            type="text"
            id="login"
            class="form-input"
            v-model="auxLogin"
            @keyup.enter="registrarme"
          />
        </div>
        <div class="input-group mb-3">
          <label for="pass" class="form-label">Password:</label>
          <input
            type="password"
            id="pass"
            class="form-input"
            v-model="auxPass"
            @keyup.enter="registrarme"
          />
        </div>
        <div class="input-group mb-3">
          <label for="passConfirm" class="form-label">Confirmar Password:</label>
          <input
            type="password"
            id="passConfirm"
            class="form-input"
            v-model="auxPassConfirm"
            @keyup.enter="registrarme"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="button-group mt-3">
          <button class="btn-submit" @click.prevent="registrarme">Registrarse</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import auth from "../common/auth.js";
import AccountRepository from "@/repositories/AccountRepository.js";

export default {
  data() {
    return {
      auxLogin: null,
      auxPass: null,
      auxPassConfirm: null,
      errorMessage: null
    };
  },
  methods: {
    async registrarme() {
      this.errorMessage = null;

      if (this.auxPass !== this.auxPassConfirm) {
        this.errorMessage = "Las contraseñas no coinciden";
        return;
      }
      if (this.auxLogin.length < 4) {
        this.errorMessage = "El login de usuario debe de ser como mínimo de 4 caracteres";
        return;
      }
      if (this.auxPass.length < 4) {
        this.errorMessage = "La contraseña debe de ser como mínimo de 4 caracteres";
        return;
      }

      try {
        const user = {
          login: this.auxLogin,
          password: this.auxPass
        };

        await AccountRepository.registerAccount(user);

        await this.autenticarme();
        this.$router.push("/notes");
      } catch (e) {
        console.error(e);
        if (e.response?.data?.message) {
          this.errorMessage = e.response.data.message;
        } else {
          this.errorMessage = "Ocurrió un error durante el registro, por favor intenta de nuevo.";
        }
      }
    },

    async autenticarme() {
      try {
        await auth.login({
          login: this.auxLogin,
          password: this.auxPass
        });
      } catch (e) {
        console.error(e);
        if (e.response?.data?.message) {
          this.errorMessage = e.response.data.message;
        } else {
          this.errorMessage = "Error de autenticación, por favor revisa tus datos.";
        }
        this.$router.push("/");
      }
    },
    volverAtras() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.form-box {
  background-color: #f0f0f0;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.form-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button-group {
  display: flex;
  justify-content: center;
}

.btn-submit {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

.back-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.arrow-icon {
  width: 24px;
  height: 24px;
}
</style>
