const { createApp } = Vue
  createApp({
    data() {
      return {
        articulos:[],
        url:'http://localhost:5000/store', 
        error:false,
        cargando:false,
        /*atributos para el guardar los valores del formulario */
        id_articulo:0,
        rubro:"", 
        descripcion:"",
        precio:0,
        stock:0,
        txtsearch:"",
        pedido:0,
        cod_cli:1210,
        fecha:"",
        estado:"",
        id_pedido:0,
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
            /* Defino los parametros de la busqueda por URL */
            const url = this.url+'/' + this.txtsearch;
                var options = {
                    method: 'GET',
                };
            /* Chequeo que se ingreso un valor */
            if (this.txtsearch == "" | this.txtsearch == 0) {
                alert("Por favor ingrese un producto.")
            } else {
                /* Envio los parametros de la busqueda */
                fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            this.articulos = data;
                            this.cargando=false
                        })
                        .catch(err => {
                            alert(err);
                            this.error=true              
                        })
            }
            },
        nuevo() {
            if (this.pedido == 0 | this.pedido == "") {
                /* Si no hay un pedido activo creo uno nuevo fields=('id_pedido','cod_cli','fecha','estado')*/
                let date = new Date();
                let user = {
                    cod_cli:this.cod_cli,
                    fecha: date,
                    estado:"A"
                };
                var options = {
                    body:JSON.stringify(user),
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                };
                alert(JSON.stringify(user));
                fetch(this.url, options)
                .then(function () {
                    alert("Se ha creado un pedido nuevo")
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al Grabar")
                })   
                
            } else {
                /* Hay un pedido activo pido confirmacion */
                let confirma = confirm("Hay un pedido activo. Desea crear uno nuevo?");
                if (confirma == true) {
                
                } else {
                    return false
                }
            }
        }
        },
    created() {
        /*this.fetchData(this.url)*/
    },
  }).mount('#app')
