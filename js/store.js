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
        total:0,
        over:0,
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
        agregar(id_articulo,descripcion,precio,cantidad) {
            if (this.pedido == 0 | this.pedido == "") {
                alert ("Cree un pedido nuevo o haga click en VER PEDIDOS para continuar uno existente")
            } else {
                cantidad=1;
                cantidad=prompt("Ingrese la cantidad que desea",cantidad);
                cantidad=parseInt(cantidad);
                if (isNaN(cantidad) == true ) {
                    alert("Error. Ingrese un numero");
                    cantidad=1;
                } else {
                    /* Recopilo los datos del producto a agregar al carrito */
                    let carrito = {
                        id_pedido:this.pedido,
                        cod_art:id_articulo,
                        descripcion: descripcion,
                        precio: precio,
                        cantp:cantidad,
                    };
                    /* Establezco los parametros del request */
                    var options = {
                        body:JSON.stringify(carrito),
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    };
                    /* Defino la URL */
                    const url = this.url+'/pedido/';
                    /* Solicito el alta */
                    fetch(url, options)
                    .then(response => response.json())
                    .then(data => {
                        this.total=this.total+(data.precio*data.cantp)
                    })
                    .catch(err => {
                        console.error(err);
                        alert("Error al Grabar")
                    })  
                }                 
            }
        },
        nuevo() {
            if (this.pedido == 0 | this.pedido == "" | this.over == 1 ) {
                /* Si no hay un pedido activo creo uno nuevo fields=('id_pedido','cod_cli','fecha','estado')*/
                let date = new Date();
                /* Compilo los parametros */
                let user = {
                    cod_cli:this.cod_cli,
                    fecha: date,
                    estado:"A"
                };
                /* Establezco los parametros del request */
                var options = {
                    body:JSON.stringify(user),
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                };
                /* Envio y recibo los datos */
                fetch(this.url, options)
                .then(response => response.json())
                .then(data => {
                    this.pedido=data.id_pedido
                    this.over=0
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al Grabar")
                })   
                
            } else {
                /* Hay un pedido activo pido confirmacion */
                let confirma = confirm("Hay un pedido activo. Desea crear uno nuevo?");
                if (confirma == true) {
                    this.over=1;
                    this.nuevo()

                } else {
                    this.over=0
                    return false
                }
            }
        }
        },
    created() {
        /*this.fetchData(this.url)*/
    },
  }).mount('#app')
