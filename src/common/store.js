import Vue from 'vue'
import Vuex from 'vuex'

import firebase from "@/firebaseInit.js";
import 'firebase/firestore';
const db = firebase.firestore();

Vue.use(Vuex)

export default new Vuex.Store({
    // State - Single source of truth; object where all data is stored.
    state: {
        posts: [],
        isAdmin: false
    },
    // Mutations - Methods used to update data in the store.
    mutations: {
        updatePosts(state, payload) {
            let fetchedPosts = [];
            payload.forEach((doc) => {
                let images;
                if (doc.data().images === undefined || doc.data().images.length === 0){
                      images = 0;
                    }
                    else {
                      images = doc.data().images}
    
                    fetchedPosts.push({
                    id: doc.id,
                    created: doc.data().created,
                    day: doc.data().day,
                    title: doc.data().title,
                    content: doc.data().content,
                    images: images,
                });
              });
            fetchedPosts.sort((c, d) => d.day.seconds - c.day.seconds);
            state.posts = fetchedPosts;
        },
        setAdmin(state, payload) {
            state.isAdmin = payload;
        }
    },
    // Actions - Methods used to asynchronously change the store, committing the changes via mutations.
    actions: {
   //     setProducts(context) {
       //     app.api.all('products').then(response => {
       //         context.commit('updateProducts', response);
       //     });
    //    },
        getPosts(context){
            db.collection("isAdmin")
            .get()
            .then((response) => {
                context.commit('updatePosts', response);
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
        }
    },
    // Getters - Methods used to retrieve and perform some operation on data in the store.
    getters: {
        getProductBySlug(state) {
            return function (slug) {
                for (let key of Object.keys(state.products)) {
                    if (state.products[key].slug == slug) {
                        return state.products[key];
                    }
                }
            }
        }
    }
})

/*
Consider commit to local storage so they persist between browser refresh

put on state:

producer: JSON.parse(localStorage.getItem('producer') || "{}")
put on mutations:

localStorage.setItem("producer",JSON.stringify(state.producer)) // OR
localStorage.removeItem("producers");
*/