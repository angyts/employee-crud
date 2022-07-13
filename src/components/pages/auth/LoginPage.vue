<template>
    <div>
        <h1>Login</h1>

        <el-input
        placeholder="email"
        v-model="email"
      ></el-input>

      <el-input placeholder="Please input password" v-model="pw" show-password></el-input>
      <button @click='login' @keyup.enter='login'>Login</button>

    </div>
</template>

<script>
import firebase from "@/firebaseInit.js";
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
            .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
            //        this.employeesData.push({
            //          id: doc.id,
            //          name: doc.data().name,
            //          date: doc.data().date,
            //        });
                    console.log(doc.id, " => ", doc.data());
                  });
                })
            .catch((error) => {
              console.log("Error getting documents: ", error);
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