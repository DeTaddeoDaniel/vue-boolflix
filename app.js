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
        selectType:'All',

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

        // ottieni data generi dei media dellle api
        ottieniAttori: function(array){
            
            console.log(array);

            array.map( (media, index) => {

                let idMedia = media.id;

                axios
                    .get('https://api.themoviedb.org/3/movie/'+idMedia+'/credits', {params:{
                        api_key: '7d986f5d7f72343a109e093583f2df92',
                        language: 'it'
                    }})
                    
                    .then(dataAPI =>{

                        let attoriLista = dataAPI.data.cast;
                        console.log('attori lista');
                        console.log(attoriLista);

                        let attori = [];

                        attoriLista.forEach(attore =>{

                            if(attore.known_for_department == "Acting"){
                                attori.push(attore.name);
                            }                    
                        });

                        Vue.set(media, 'attori', attori);
                    })

                    .catch(error =>{
                        console.log(error)
                        Vue.set(media, 'attori', []);
                    })
            })


        },

        // gestione e modifica dati ricevuti dalle API
        modificheDataRicevuti: function(typeElement){

            // tipo di array da prendere ( movie o serie tv)
            if( typeElement == 'movie'){
                array = this.movies;
            } else {
                array = this.serieTv;
            }

            // mappa tutto il media e indice di posizione
            array.map( (element, index) => {

                // inserisci type dell'elemento
                Vue.set(array[index], 'type', typeElement);

                // inserisci visibility dell'elemento
                Vue.set(array[index], 'visibility', true);

                // inserisci poster dell'elemento
                if(array[index].poster_path != null){
                    // aggiungi parte mancante del link del poster
                    Vue.set(array[index], 'poster_path', 'https://image.tmdb.org/t/p/w500' + element.poster_path)
                }

                // Inserisci generi dell'elemento
                this.generiMedia(array)

                // Inserisci stelle in base al voto
                this.votoInStelle(array)

                // Inserisci attori
                this.ottieniAttori(array)

            })
            
            // unisci i due array film e serie tv
            this.addMediaArray()

            // filtra elementi di ricerca
            this.filter()
        },

        // gestione errori API
        erroreAPI: function(error, info){
            alert('Error in the API ' + info + '\nPer informazione dell\'errore guardare la console log');
            console.log(error);
            
        },

        // trasforma il voto in base 10 a base 2 con le stelle
        votoInStelle: function(array){

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
                
                // aggiorna oggetto media con la variabile oggetto voto stelle
                array[index] = { ...movie, votoStelle};
            })
        },

        // aggiungi campo array i generi da numeri  (movie e serie tv)
        generiMedia: function(array){

            // Prendi un elemento movie singolarmente
             array = array.map( movie =>{
                
                // crea variabile array dei generi
                let generi = []

                // se sono presenti generi dal API del media
                if(movie.genre_ids.length != 0){           

                    // per ogni elemento genere ottieni nome
                    movie.genre_ids.map( (genere, posizione) => {
                        
                        // controlla se esiste l'id genere
                        if (this.genereMediaLista.some(e => e.id == genere)) {
                            
                            // ottieni indice della corrispodenza mappando l'array e torna id genere e 
                            // se corrisponde torna l'indice in cui si trova nell'array genereMediaLista
                            pos = this.genereMediaLista.map(function(e) { return e.id; }).indexOf(genere);

                            // inserisci elemento corrispodente in generi il nome del genere
                            generi.push(this.genereMediaLista[pos].name)

                        // caso in cui non esiste id genere
                        } else {
                            console.log('non trovata corrispodenza: '+ genere + ' in posizione ' + posizione)
                        }
                        
                    })

                    
                // caso in cui non è presenti generi id
                } else{
                    // console.log('media generi non disponibili')
                }
                
                // aggiunge attribute generi dell'elemento
                Vue.set(movie, 'generi', generi)

            })
        },

        // riempio array che uso per stampare tutti i media ricevuti mediante API
        addMediaArray: function(){
            this.media = this.movies.concat(this.serieTv)
        },

        // filtra elementi per genere
        filter: function(){
            
            // filtra per genere dell'elemento
            if( this.selectText != 'All'){

                this.media.forEach( (media,index) => {

                    // console.log(this.selectText)
                    console.log(media)
                    
                    if(media.generi.includes(this.selectText)){
                        media.visibility = true;
                    } else {
                        media.visibility = false;
                    }
                })

            } else {
                this.media.forEach( (media,index) => {
                    media.visibility = true;
                })
            }

            // filtra per tipo dell'elemento
            if( this.selectType != 'All'){

                this.media.forEach( (media,index) => {

                    // console.log(this.selectText)
                    // console.log(media.genre_ids)
                    
                    if(media.type == this.selectType && media.visibility){
                        media.visibility = true;
                    } else {
                        media.visibility = false;
                    }
                })

            }
        },

        // inserimento lingua
        lingua: function(code){

            // console.log('codice:'+code);
            
            switch(code){
                case 'en':
                    // console.log('caso 1')
                    return 'Inglese';
                case 'it':
                    // console.log('caso 2')
                    return 'Italiana';
                case 'de':
                    // console.log('caso 3')
                    return 'Tedesca';
                case 'es':
                    // console.log('caso 4')
                    return 'Spagnolo';
                case 'fr':
                    // console.log('caso 5')
                    return 'Francese';
                case 'ru':
                    // console.log('caso 6')
                    return 'Russo';
                case 'no':
                    // console.log('caso 7')
                    return 'Norvegese';
                case 'ja':
                    // console.log('caso 8')
                    return 'Giapponese';
                default:
                    // console.log('caso default')
                    return code;
            }
        },

        // inserimento lingua
        bandiere: function(code){

            // console.log('codice bandiera:'+code);
            
            let srcParziale = 'Flag/Flag_of_';
            let fileType = '.svg';

            switch(code){
                case 'en':
                case 'it':
                case 'de':
                case 'es':
                case 'fr':
                case 'ru':
                case 'no':
                case 'ja':
                    
                    return srcParziale+code+fileType;
                
                default:
                    console.log('caso default')
                    return null;
            }
        }
    },

})