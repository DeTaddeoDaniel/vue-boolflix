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
        selectText:'All',

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
                    // console.log('movies');
                    // console.log(this.movies);
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
                    // console.log('serieTv');
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
                    // console.log('generi media');
                    // console.log(this.genereMediaLista);
                    
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
            this.generiMedia(typeElement)
            this.addVisibiliy(typeElement)
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

            console.log(typeMedia)
            
            // tipo di array da prendere
            if( typeMedia == 'movie'){
                array = this.movies;
            } else {
                array = this.serieTv;
            }

            // Prendi un elemento movie singolarmente
             array = array.map( (movie, index) =>{
                
                if(movie.genre_ids.length != 0){
                    
                    // prendi ogni numero presente del array generi
                    movie.genre_ids.forEach( (genere, index) => {
                        
                        // variabili while coppia e variabile uscita
                        let indexCoppia = 0;
                        let trovato = false;
                        
                        // trova lo stesso id
                        while(!trovato && indexCoppia < this.genereMediaLista.length){
                            
                            // confronta numero id movie e numero id generi
                            if(parseInt(genere) == this.genereMediaLista[indexCoppia].id){
                                
                                // esci dal ciclo perchè è stat trovato
                                trovato = true;
                                console.log('corrispodenza: '+this.genereMediaLista[indexCoppia].name);

                            // continua al successivo elemento id generi
                            } else {
                                indexCoppia++;
                            }

                        }

                        // controlla se esiste id genere associato
                        if(indexCoppia != this.genereMediaLista.length){
                            
                            // sostutuisci id con nome del genere
                            movie.genre_ids[index] = this.genereMediaLista[indexCoppia].name;

                        // cancella id non associato
                        } else {
                            movie.genre_ids.splice(index, 1)
                        }

                    })

                } else{
                    console.log('media generi non disponibili')
                }

            })
        },

        // riempio array che uso per stampare tutti i media ricevuti mediante API
        addMediaArray: function(){
            this.media = this.movies.concat(this.serieTv)
            // console.log('media')
            // console.log(this.media)
        },

        // filtra elementi per genere
        filter: function(){
            console.log(this.selectText)
        },

         // add to visibility item variable
        addVisibiliy: function(typeMedia){

            // tipo di array da prendere ( move o serie tv)
            if( typeMedia == 'movie'){
                array = this.movies;
            } else {
                array = this.serieTv;
            }

            // aggiungi attributo visibility a tutti gli elementi
            array = array.map( media =>{
                return { ...media, visibility : true};
            })
        }

    },

})