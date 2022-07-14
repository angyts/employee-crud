import Vue from 'vue'
import Vuex from 'vuex'

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
            payload.sort((c, d) => d.day.seconds - c.day.seconds);
            state.posts = payload;
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