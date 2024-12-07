<template>
  <div class="login-container">
    <h1 class="login-title">Iniciar Sesión</h1>
    <form @submit.prevent="autenticarme" class="login-form">
      <div class="form-group">
        <label for="login" class="form-label">Login:</label>
        <input
          type="text"
          id="login"
          v-model="auxLogin"
          class="form-input"
          @keyup.enter="autenticarme"
          required
        />
      </div>
      <div class="form-group">
        <label for="pass" class="form-label">Password:</label>
        <input
          type="password"
          id="pass"
          v-model="auxPass"
          class="form-input"
          @keyup.enter="autenticarme"
          required
        />
      </div>
      <div class="form-group">
        <button type="submit" class="login-button">Autenticarse</button>
      </div>
      <div class="form-group">
        <button type="button" class="register-button" @click="registrarme">Registrarse</button>
      </div>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import auth from "../common/auth.js";

export default {
  data() {
    return {
      auxLogin: null,
      auxPass: null,
      errorMessage: null
    };
  },
  methods: {
    async autenticarme() {
      if (this.auxLogin == null || this.auxPass == null) {
        this.errorMessage = "Introduzca todos los campos";
        return;
      }
      try {
        await auth.login({
          login: this.auxLogin,
          password: this.auxPass
        });
        this.$router.push("/notes");
      } catch (e) {
        this.errorMessage = "Error al registrarse, intentelo de nuevo";
      }
    },
    registrarme() {
      this.$router.push("/register");
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

.login-button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.login-button:hover {
  background-color: #0056b3;
}

.register-button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.register-button:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
