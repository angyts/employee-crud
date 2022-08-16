<template>
  <div>
    <el-popover
      placement="bottom"
      title="New Post"
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
      <el-button round slot="reference" type="success" size="mini"
        >Add New Post</el-button
      >
    </el-popover>

    <div id="entry-area">
      <div id="entry" class="el-row" v-for="post in posts" :key="post.id">
          <div class="el-row" id="title">
            <h4>{{ post.title }} written on {{ dateFromSecs(post.day.seconds) }}</h4>
          </div>
          <div class="el-row">
             <pre>{{ post.content }}</pre>
            <template>
              <el-popover
                placement="bottom"
                title="Edit Post"
                trigger="click"
              >
                <el-input
                  :placeholder="post.title"
                  v-model="post.title"
                ></el-input>
                <el-input
                  :placeholder="post.content"
                  v-model="post.content"
                  @blur="updatePost(post.id, post.title, post.content)"
                ></el-input>                
              <el-button round size="mini" slot="reference">Edit Post</el-button>            
              </el-popover>
              <el-button size="mini" round type="danger" @click="deletePost(post.id)">Delete</el-button
              >
            </template>
          </div>      
          <hr>                   
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
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
    dateFromSecs(sec){
     let t = moment.unix(sec);
      return t.format("D / MMM / YYYY");
    },
  },
  computed:{
  },
  mounted() {
    this.posts = this.$store.state.posts;
  },
};
</script>

<style scoped>
#entry-area {
  background-color: rgb(47, 140, 174, 0.225);
  padding: 5px 5px 5px 5px;
}

#entry {
  background-color: rgba(47, 140, 174, 0.525);
  margin-left: 30px;
  margin-top: 10px;
  margin-right: 13px;
  padding: 6px 10px 20px 20px;
  overflow: auto;
  display: block;
}

pre, #title {
  font-family: 'Courier New', Courier, monospace;
    overflow-x: hidden;
    white-space: pre-wrap;
    max-width: 100%;
    height: auto;
}
</style>