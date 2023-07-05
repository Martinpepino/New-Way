const { createApp } = Vue
  createApp({
    data() {
      return {
        articulos:[],
        url:'http://localhost:5000/store', 
        error:false,
        cargando:true,
        /*atributos para el guardar los valores del formulario */
        id_articulo:0,
        rubro:"", 
        descripcion:"",
        precio:0,
        stock:0,
        txtsearch:"",
    }  
    },
    methods: {
        fetchData(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.articulos = data;
                    this.cargando=false
                })
                .catch(err => {
                    console.error(err);
                    this.error=true              
                })
        },
        buscar() {
            const url = this.url+'/' + this.txtsearch;
                var options = {
                    method: 'GET',
                }
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.articulos = data;
                    this.cargando=false
                })
        },
    },
    created() {
        this.fetchData(this.url)
    },
  }).mount('#app')
