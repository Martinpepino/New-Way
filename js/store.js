const { createApp } = Vue
  createApp({
    data() {
      return {
        /* data array */
        articulos:[],
        detpedidos:[],
        pedidos:[],
        /* host */
        url:'http://localhost:5000/store', 
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
        subtotal:0,
        openstatus:"A",
        /* pantallas */
        error:false,
        cargando:false,
        carrito:false,
        buscador:true,
        pedidoblank:false,
        statuspedidos:false,
        tablaarticulos:false,
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
        /* Pantalla de mis pedidos */
        mispedidos(cliactual) {
            this.statuspedidos=true;
            this.carrito=false;
            this.buscador=false;
            /* Envio el ID del pedido */
            const url = this.url+'/status/'+ cliactual;
            var options = {
                method: 'GET',
            };
            fetch(url,options)
            .then(response => response.json())
            .then(data => {
                /* muestro el detalle del pedido */
                this.pedidos = data;
            })
            .catch(err => {
                console.error(err);
                alert("Ha ocurrido un error")             
            })
        },
        /* Buscador de articulos */
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
                            this.cargando=false;
                            this.tablaarticulos=true;
                        })
                        .catch(err => {
                            alert(err);
                            this.error=true;   
                            this.tablaarticulos=false;           
                        })
            }
            },
        /* Borra un articulo de un pedido */
        quitar(curid) {
            /* Pido confirmacion */
            let confirma = confirm("Esta seguro de quitar el articulo de este pedido?");
            if (confirma == true) {
                const url = this.url+'/' + curid;
                var options = {
                    method: 'DELETE',
                }
                fetch(url, options)
                    .then(res => res.text()) // or res.json()
            } else {
                return false
            };
            /* actualizo el detalle */
            this.actualizarcarrito()
        },
        /* Agregar articulos al pedido actual */
        agregar(id_articulo,rubro,descripcion,precio,cantidad) {
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
                        rubro: rubro,
                        descripcion: descripcion,
                        precio: precio,
                        cantp:cantidad,
                        subtotal:precio * cantidad,
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
                        console.log(data), 
                        this.actualizarcarrito()
                    })
                    .catch(err => {
                        console.error(err);
                        alert("Error al Grabar")
                    })  
                }                 
            }
        },
        /* Actualiza la ventana del carrito y calcula el total del pedido */
        actualizarcarrito() {
            /* Envio el ID del pedido */
            const url = this.url+'/detalle/'+ this.pedido;

            var options = {
                method: 'GET',
            };
            fetch(url,options)
            .then(response => response.json())
            .then(data => {
                /* muestro el detalle del pedido */
                this.detpedidos = data;
                if (data == "" | data == 0) {
                    this.total = 0
                } else {
                /* tomo el json y totalizo */
                    var res = data.map(data => data.subtotal).reduce((acc, amount) => acc + amount);
                    this.total=res
                };
            })
            .catch(err => {
                console.error(err);
                alert("Ha ocurrido un error")             
            })
        },
        /* Oculta el buscador y presenta los datos del detalle del pedido */
        verpedidos(idcarga,stad) {
            /* Oculto la pantalla del buscador y presento el detalle del pedido */
            this.pedido=idcarga;
            this.openstatus=stad;
            this.carrito=true;
            this.buscador=false;      
            this.statuspedidos=false;  
            this.pedidoblank=true;
            this.actualizarcarrito();
        },
        /* Oculta el detalle del pedido y me lleva al buscador principal */
        verbuscador() {
            /* Oculto la pantalla del detalle y presento el buscador */
            this.carrito=false;
            this.buscador=true;      
            this.statuspedidos=false;      
        },
        /* Genera un pedido nuevo */
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
                    this.pedido=data.id_pedido,
                    this.pedidoblank=true,
                    this.over=0,
                    this.openstatus="A"
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al Grabar")
                })   
                
            } else {
                /* Hay un pedido activo pido confirmacion */
                let confirma = confirm("Hay un pedido activo. Desea crear uno nuevo?");
                if (confirma == true) {
                    /* Deseo abandonar este pedido y crear uno nuevo */
                    this.over=1;
                    this.nuevo()
                } else {
                    this.over=0
                    return false
                }
            }
        },
        /* Permite desde la pantalla de mis pedidos continuar cargando articulos */
        cargar(idcarga) {
            this.pedido=idcarga;
            this.carrito=false;
            this.buscador=true;      
            this.statuspedidos=false;  
            this.pedidoblank=true;
            this.actualizarcarrito();
        },
        /* Elimina el pedido de un cliente */
        eliminarpedidos(idcarga) {
           /* Pido confirmacion */
           let confirma = confirm("Esta seguro de eliminar este pedido?");
           if (confirma == true) {
               const url = this.url+'/pedido/' + idcarga;
               var options = {
                   method: 'PUT',
               }
               fetch(url, options)
                   .then(res => res.text()) // or res.json()
           } else {
               return false
           };
           /* actualizo el detalle */
           this.mispedidos();
        },
        /* Modifica las cantidades del pedido */        
        modifcant(idmodif,defa,defaprecio) {
            let cant = prompt("Ingrese la cantidad",defa);
            if (isNaN(cant) == true ) {
                alert("Error. Ingrese un numero");
                cant=1;
            } else {
                /* 'id','id_pedido','cod_art','rubro','descripcion','cantp','precio','subtotal' */
                let detalle = {
                    id: idmodif,
                    cantp: cant,
                    precio: defaprecio,
                    subtotal: cant * defaprecio,
                }
                var options = {
                    body: JSON.stringify(detalle),
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                }    
                const url = this.url+'/modifica/' + idmodif;
                fetch(url, options)
                    .then(res => res.text()) // or res.json()
                    .catch(err => {
                        console.error(err);
                        alert("Error al Modificar")
                        return false
                    });
                this.detpedidos=[];
                this.actualizarcarrito();
            }
            
        },
        /* Cierra un pedido */
        cerrar(idclose) {
            /* Pido confirmacion */
           let confirma = confirm("Esta seguro de cerrar y enviar este pedido? Luego no se podra modificar el contenido del mismo ni volver a abrirlo.");
           if (confirma == true) {
               const url = this.url+'/cerrar/' + idclose;
               var options = {
                   method: 'PUT',
               }
               fetch(url, options)
                   .then(res => res.text()) // or res.json()
           } else {
               return false
           };
           /* actualizo el detalle */
           this.mispedidos();
        }
        },
    /* Funcion de INIT */
    created() {
        /*this.fetchData(this.url)*/
    },
  }).mount('#app')
