new Vue({
    el:'#app',

    data:{
        test: 'test',
    },

    beforeCreate() {
        
        

        axios
            .get('https://flynn.boolean.careers/exercises/api/array/music')
            
            .then(dataAPI =>{
                
                console.log('test')
                
            })

            .catch(error =>{
                console.log('Error in the API call');
                console.log(error);
            })
    },

})