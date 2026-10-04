const { createApp } = Vue
  createApp({
    data() {
        return {
            usuario:"",
            clave:"",
            id:0,
            denom:"",
            status:"",
            statusshow:false,
            url:'http://localhost:5000/login',
        }
    },
    methods: {    
         autorizar(us,pw) {
            const url = this.url + '/' + us + '/' + pw;
            var options = {
                method: 'GET',
            };
            if (us=="" | us==0 | pw=="" | pw==0) {
                this.statusshow=true,
                this.status="Ingrese numero de cliente y contraseña"
            } else {
                fetch(url,options)
                .then(response => response.json())
                .then(data => {
                    this.id=data.id_cliente,
                    this.denom=data.name,
                    this.status=data.passw,
                    urlfinal=data.status,
                    this.statusshow=true,
                    sessionStorage.clienteact=this.id
                    sessionStorage.nombreact=this.denom
                    this.usuario="",
                    this.clave=""
                    if (data.status != 0) {
                        window.open(urlfinal,'_self')
                    }
                })
                .catch(err => {
                    alert(err);     
                })
            }
        }
    }
}).mount('#log')
