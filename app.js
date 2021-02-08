new Vue({
    el:'#app',

    data:{
        test: 'test',
        searchInput: ''
    },

    methods: {
        ottieniMovies: function(){

            axios
                .get('https://api.themoviedb.org/3/search/movie', {params:{
                    api_key: '7d986f5d7f72343a109e093583f2df92',
                    query: this.searchInput
                }})
                
                .then(dataAPI =>{
                    
                    console.log(dataAPI)
                    
                })

                .catch(error =>{
                    console.log('Error in the API call');
                    console.log(error);
                })
        }
    },

})