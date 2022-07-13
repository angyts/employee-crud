<template>
    <div>
        <h1>Register</h1>

        <el-input
        placeholder="email"
        v-model="email"
      ></el-input>

      <el-input placeholder="Please input password" v-model="pw" show-password></el-input>
      <button @click='register' @keyup.enter='register' data-test='register-button'>Register</button>

    </div>
</template>

<script>
import firebase from "@/firebaseInit.js";

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
        register: function() {
          firebase.auth().createUserWithEmailAndPassword(this.email, this.pw)
            .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            console.log(user);
            // ...
            })
            .catch((error) => {
             var errorCode = error.code;
             var errorMessage = error.message;
          console.log(error);
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
//            this.errors = [];
//
  //          app.api
    //            .register(this.email, this.password, this.name)
      //          .then(response => {
        //            if (!response.error) {
          //              // Send the now logged in user to the home page
            //            this.$router.push({ name: 'home' });
              //      } else {
                //        // Load/show errors
                  //      this.errors.push(response.error);
                  //  }
      //          });
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