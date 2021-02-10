new Vue({
    el:'#app',

    data:{
        test: 'test',

        // numero Stelle massimo
        maxStelle: 5,

        // testo input
        searchInput: 'pippo',

        // array film from API
        movies: [],

        // array country
        countries: []
    },

    beforeMount() {

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
                    this.votoInStelle()
                    
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

        votoInStelle: function(){
            
            // add to visibility item variable
             this.movies = this.movies.map( movie =>{
                let votoStelle = {
                    voto: 0,
                    stellaMeta: false,
                    mancanti: 0
                }

                // numero stelle piene
                votoStelle.voto = Math.floor(movie.vote_average / 2);
                console.log('voto stelle piene: ' + votoStelle.voto);

                // numero decimale per stella meta eventuale
                let decimali = parseInt((movie.vote_average / 2 - votoStelle.voto) * 100);
                console.log('voto stella meta: ' + decimali);

                // base al valore decimale decise se mostrare o non la stella
                if(decimali >= 50 && votoStelle.voto < 10){
                    votoStelle.stellaMeta = true;
                } else {
                    votoStelle.stellaMeta = false;
                }

                // numero di stelle vuote
                if(votoStelle.stellaMeta){
                    votoStelle.mancanti = this.maxStelle - votoStelle.voto - 1;
                } else{
                    votoStelle.mancanti = this.maxStelle - votoStelle.voto;
                }

                // stampa oggetto stelle
                console.log(votoStelle)

                return { ...movie, votoStelle};
            })
        }


    },

})