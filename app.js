new Vue({
    el:'#app',

    data:{
        test: 'test',

        // testo input
        searchInput: 'pippo',

        // array film from API
        movies: [],

        // array country
        countries: []
    },

    beforeMount() {
        // ottieni tutte le bandiere
        this.ottieniCountry()
    },

    methods: {
        ottieniMovies: function(){

            axios
                .get('https://api.themoviedb.org/3/search/movie', {params:{
                    api_key: '7d986f5d7f72343a109e093583f2df92',
                    query: this.searchInput,
                    language: 'it'
                }})
                
                .then(dataAPI =>{
                    this.movies = dataAPI.data.results
                    console.log(this.movies)
                    this.ottieniPosterMedia()
                    
                })

                .catch(error =>{
                    console.log('Error in the API media');
                    console.log(error);
                })

            
        },

        ottieniPosterMedia: function(){
            this.movies.forEach( movie => {
                        if(movie.poster_path != null){
                            movie.poster_path = 'https://image.tmdb.org/t/p/original'+movie.poster_path;
                        }
                    });
        },

        ottieniCountry: function(){
            axios
                .get('https://restcountries.eu/rest/v2/all?fields=name;flag;alpha2Code')
                .then(apiState =>{
                    console.log(apiState.data)
                    this.countries = apiState.data
                })

                .catch(error => {
                    console.log('Error in the API country');
                    console.log(error);
                })
        }
    },

})