<template>
  <div>
    <el-popover
      placement="bottom"
      title="New Post"
      width="800"
      trigger="click"
    >
      <el-input
        placeholder="Post Title"
        v-model="title"
      ></el-input>
      <el-input
        placeholder="Day"
        v-model="day"
      ></el-input>      
      <el-input
        placeholder="Entry"
        v-model="content"
        @blur="createPost(title, day, created, content)"
      ></el-input>      
      <el-button round slot="reference" type="success"
        >Add New Post</el-button
      >
    </el-popover>
    <el-table
      :data="posts.filter(
          (data) =>!search || data.title.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%;"
    >
      <el-table-column label="Day" prop="day"> </el-table-column>
      <el-table-column label="Title" prop="title"> </el-table-column>
      <el-table-column label="Entry" prop="content"> </el-table-column>
      <el-table-column align="right">
        <template slot="header" :slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            title="Edit Post"
            width="200"
            trigger="click"
          >
            <el-input
              placeholder="John Doe"
              v-model="scope.row.name"
              @blur="updateEmployee(scope.row.id, scope.row.name, date)"
            ></el-input>
            <el-button size="mini" slot="reference">Edit</el-button>
          </el-popover>
          <el-button
            size="mini"
            type="danger"
            @click="deleteEmployee(scope.row.id)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import firebase from "@/firebaseInit.js";

const db = firebase.firestore();


export default {
  data() {
    return {
      posts: [],
      title: "",
      content: "",
      created: new Date().toISOString().slice(0, 10),
      day: "",
      search: "",
    };
  },
  methods: {
    createPost(title, day, created, content) {
      if (title != "" && content != "" && day != "") {
        db.collection("isAdmin")
          .add({ title: title, day: day, created: created, content: content})
          .then(() => {
            console.log("Document successfully written!");
            this.readPosts();
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
        this.title = "";
        this.day = "";
        this.content = "";
      }
    },
    readPosts() {
      this.posts = [];
      db.collection("isAdmin")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.posts.push({
                id: doc.id,
                created: doc.data().created,
                day: doc.data().day,
                title: doc.data().title,
                content: doc.data().content,
            });
            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    updateEmployee(id, name, date) {
      db.collection("employees")
        .doc(id)
        .update({
          name: name,
          date: date,
        })
        .then(() => {
          console.log("Document successfully updated!");
          this.readEmployees();
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
    deleteEmployee(id) {
      db.collection("employees")
        .doc(id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          this.readEmployees();
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
  },
  mounted() {
    this.posts = this.$store.state.posts;
  },
};
</script>
