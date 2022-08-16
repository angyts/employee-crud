<template>
    <div>
        <h1>Login</h1>

        <el-input
        placeholder="Username"
        v-model="email"
      ></el-input>

      <el-input placeholder="Please input password" v-model="pw" show-password></el-input>
      <p></p>
      <el-button @click='login' @keyup.Enter='login'>Login</el-button>

    </div>
</template>

<script>
import firebase from "@/firebaseInit.js";
import store from "@/common/store.js";

const db = firebase.firestore();

export default {
    name: '',
    data: function() {
        return {
            email: '',
            pw: '',
            loggedIn: false
        };
    },

    methods: {
        login: function() {
          firebase.auth().signInWithEmailAndPassword(this.email, this.pw)
            .then((userCredential) => {
            // Signed in 
            
            var user = userCredential.user;
            console.log(user);
            
            db.collection("isAdmin")
            .get()
            .then(() => {
                // console.log(doc.id, " => ", doc.data());
                store.commit('setAdmin', true);

                // Send the now logged in user to the diary
                this.$router.push({ name: 'diary' }).catch();                  
              })
            .catch(() => {
              // Logged in but not admin user
              this.$router.push({ name: 'home' }).catch();
            });
            })
            .catch((error) => {
             var errorCode = error.code;
             var errorMessage = error.message;

            this.$alert(errorMessage, "Error Code: " + errorCode, {
                      confirmButtonText: 'OK',
                      callback: action => {
                        this.$message({
                          type: 'info',
                          message: `action: ${ action }`
                        });
                      }
                  });
            });
        }
    },
    mounted: function() {
    }
};
</script>

<style scoped>
input {
    text-align: center;
}
</style>