const { createApp } = Vue
  createApp({
    data() {
        return {
            usuario:"",
            clave:"",
        }
    },
    methods: {    
         autorizar(us,pw) {
            const url = this.url+'/'+us+'/'+pw;
            var options = {
                method: 'GET',
            };

            fetch(url,options)
            .then(data => {
                console.log(data), 
                alert(data)
            })
        }
    }
}).mount('#log')
