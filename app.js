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
        serieTv:[],

        // array che mostra tutti i media
        media:[],

        // genere media
        genereMediaLista: [],

        // array country
        countries: []
    },

    beforeMount() {
        this.ottieniGeneriMedia();
    },

    methods: {

        // chiedi alle API movie e serie tv corrispodenti
        getDataAPI:function(){
            this.ottieniMovies();
            this.ottieniSerieTv();
        },

        // ottieni movie data
        ottieniMovies: function(){

            axios
                .get('https://api.themoviedb.org/3/search/movie', {params:{
                    api_key: '7d986f5d7f72343a109e093583f2df92',
                    query: this.searchInput,
                    language: 'it'
                }})
                
                .then(dataAPI =>{
                    this.movies = dataAPI.data.results;
                    console.log('movies');
                    console.log(this.movies);
                    this.modificheDataRicevuti('movie');
                    
                })

                .catch(error =>{
                    this.erroreAPI(error, 'movies')
                })
        },

        // ottieni serie tv data
        ottieniSerieTv: function(){

            axios
                .get('https://api.themoviedb.org/3/search/tv', {params:{
                    api_key: '7d986f5d7f72343a109e093583f2df92',
                    query: this.searchInput,
                    language: 'it'
                }})
                
                .then(dataAPI =>{
                    this.serieTv = dataAPI.data.results
                    console.log(this.serieTv);
                    console.log('serieTv');
                    this.modificheDataRicevuti('serieTv');
                })

                .catch(error =>{
                   this.erroreAPI(error, 'serie tv')
                })  
        },

        // ottieni data generi dei media dellle api
        ottieniGeneriMedia: function(){

            axios
                .get('https://api.themoviedb.org/3/genre/movie/list', {params:{
                    api_key: '7d986f5d7f72343a109e093583f2df92',
                    language: 'it'
                }})
                
                .then(dataAPI =>{
                    this.genereMediaLista = dataAPI.data.genres;
                    console.log('generi media');
                    console.log(this.genereMediaLista);
                    
                })

                .catch(error =>{
                    this.erroreAPI(error, 'genres media')
                })
        },

        // gestione e modifica dati ricevuti dalle API
        modificheDataRicevuti: function(typeElement){

            // inserisce e modifica eventuali attributi per la visualizzazione
            this.typeMedia(typeElement)
            this.ottieniPosterMedia(typeElement)
            this.votoInStelle(typeElement)
            this.generiMedia(this.typeMedia)
            this.addMediaArray()
        },

        // richiesta immagine poster media
        ottieniPosterMedia: function(typeMedia){

            // tipo di array da prendere ( move o serie tv)
            if( typeMedia == 'movie'){
                array = this.movies;
            } else {
                array = this.serieTv;
            }

            // aggiorna indirizzo path poster con url completo
            array.forEach( (movie,index) => {

                // controlla se esiste un immagine del media
                if(movie.poster_path != null){
                    movie.poster_path = 'https://image.tmdb.org/t/p/w500'+movie.poster_path;
                    // console.log(index + ' - ' + movie.poster_path)
                }
            });
            
        },

        // gestione errori API
        erroreAPI: function(error, info){
            alert('Error in the API ' + info + '\nPer informazione dell\'errore guardare la console log');
            console.log(error);
            
        },

        // trasforma il voto in base 10 a base 2 con le stelle
        votoInStelle: function(typeMedia){
            
            // tipo di array da prendere
            if( typeMedia == 'movie'){
                array = this.movies;
            } else {
                array = this.serieTv;
            }

            // add to stelle oggetto
             array = array.map( (movie, index) =>{

                // variabile oggetto che indica il numero di stelle piene, stelle vuote e eventuale stella mezza piena
                let votoStelle = {
                    votoNumericoStelle: movie.vote_average / 2,
                    voto: 0,
                    stellaMeta: false,
                    mancanti: 0
                }

                // numero stelle piene
                votoStelle.voto = Math.floor(movie.vote_average / 2);

                // numero decimale per stella meta eventuale
                let decimali = parseInt((movie.vote_average / 2 - votoStelle.voto) * 100);


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
                // console.log(votoStelle)

                // aggiorna oggetto media con la variabile oggetto voto stelle
                array[index] = { ...movie, votoStelle};
            })
        },

        // inserisce attributo type in base al tipo media (movie o serie tv)
        typeMedia: function(typeMedia){

            // tipo di array da prendere
            if( typeMedia == 'movie'){
                array = this.movies;
            } else {
                array = this.serieTv;
            }

            // aggiorna l'array scelto con attributo type del media specificato
            array = array.map( (disco,index) => {
                array[index] = { ...disco, type: typeMedia};
            }) 
            
        },

        // aggiungi campo array i generi da numeri  (movie e serie tv)
        generiMedia: function(typeMedia){
            
            // tipo di array da prendere
            if( typeMedia == 'movie'){
                array = this.movies;
            } else {
                array = this.serieTv;
            }

            // add to stelle oggetto
             array = array.map( (movie, index) =>{

                // variabile oggetto che indica il numero di stelle piene, stelle vuote e eventuale stella mezza piena
                let generiLista = [];

                // variabile d'uscita
                let count = 0;

                // riempi array generi con testo
                while(count < movie.genre_ids.length){

                    console.log(movie.genre_ids[count]);
                    console.log(this.genereMediaLista[0].id)
                    count++;
                }

                // stampa oggetto stelle
                console.log(generiLista);
            })
        },

        // riempio array che uso per stampare tutti i media ricevuti mediante API
        addMediaArray: function(){
            this.media = this.movies.concat(this.serieTv)
            console.log('media')
            console.log(this.media)
        }

    },

})