new Vue({
    el:'#app',

    data:{
        test: 'test',

        // testo input
        searchInput: 'pippo',

        // array film from API
        movies: []
    },

    methods: {
        ottieniMovies: function(){

            axios
                .get('https://api.themoviedb.org/3/search/movie', {params:{
                    api_key: '7d986f5d7f72343a109e093583f2df92',
                    query: this.searchInput,
                }})
                
                .then(dataAPI =>{
                    console.log(dataAPI.data)
                    this.movies = dataAPI.data.results
                    console.log(this.movies[0])

                    this.movies.forEach((movie,index) => {
                        if(movie.poster_path != null){
                            movie.poster_path = 'https://image.tmdb.org/t/p/original'+movie.poster_path;
                        }
                    });
                    
                })

                .catch(error =>{
                    console.log('Error in the API call');
                    console.log(error);
                })
        }
    },

})