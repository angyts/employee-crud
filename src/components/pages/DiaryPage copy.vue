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
    <el-date-picker
      v-model="day"
      type="date"
      placeholder="Day"
      format="dd/MM/yyyy"
      :picker-options="pickerOptions">
    </el-date-picker>        
      <el-input
        placeholder="Entry"
        type="textarea"
        :rows="6"
        v-model="content"
        @blur="createPost(title, day, created, content)"
      ></el-input>      
      <el-button round slot="reference" type="success"
        >Add New Post</el-button
      >
    </el-popover>
    <el-table :default-sort = "{prop: 'day.seconds', order: 'descending'}"
      :data="posts.filter(
          (data) =>!search || data.title.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" width="80"> </el-table-column>
      <el-table-column label="Day" prop="day.seconds" sortable> </el-table-column>
      <el-table-column label="Created" prop="created.seconds"> </el-table-column>
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
              v-model="scope.row.title"
            ></el-input>
            <el-input
              v-model="scope.row.content"
              @blur="updatePost(scope.row.id, scope.row.title, scope.row.content)"
            ></el-input>            
            <el-button size="mini" slot="reference">Edit Post</el-button>
          </el-popover>
          <el-button
            size="mini"
            type="danger"
            @click="deletePost(scope.row.id)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from 'moment';

//

// TODO 

// moment.unix(Number)
// moment().format(D / MMM / YYYY);
import firebase from "@/firebaseInit.js";

const db = firebase.firestore();



export default {
    moment,
  data() {
    return {
      posts: [],
      title: "",
      content: "",
      created: new Date(),
      day: "",
      search: "",
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: 'Today',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: 'Yesterday',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: 'Day Before',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            }
          }]
        },
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
    // This function should be in the store actions instead
    // TODO //
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
            // console.log(doc.id, " => ", doc.data());
            this.$store.commit('updatePosts', this.posts);
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    updatePost(id, title, content) {
      db.collection("isAdmin")
        .doc(id)
        .update({
          title: title,
          content: content,
        })
        .then(() => {
          console.log("Document successfully updated!");
          this.readPosts();
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
    deletePost(id) {
      db.collection("isAdmin")
        .doc(id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          this.readPosts();
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
  },
  computed:{
  },
  mounted() {
    this.posts = this.$store.state.posts;
  },
};
</script>
