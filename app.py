from flask import Flask,jsonify,request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app=Flask(__name__) #Crea el objeto app de la clase Flask
CORS(app) #permite acceder desde el front al back

# configuro la base de datos, con el nombre el usuario y la clave
# app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://user:password@localhost/proyecto'
app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://root:@localhost/newway'
# URI de la BBDD                          driver de la BD  user:clave@URLBBDD/nombreBBDD
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False #none
db= SQLAlchemy(app)   #crea el objeto db de la clase SQLAlquemy
ma=Marshmallow(app)   #crea el objeto ma de de la clase Marshmallow

# ---------fin configuracion-----------

#definimos la tabla
class Articulos(db.Model):
    id_articulo=db.Column(db.Integer, primary_key=True)
    rubro=db.Column(db.String(25))
    descripcion=db.Column(db.String(40))
    precio=db.Column(db.Integer)
    stock=db.Column(db.Integer)
    def __init__(self,id_articulo,rubro,descripcion,precio,stock):
        self.id_articulo = id_articulo
        self.rubro = rubro
        self.descripcion = descripcion
        self.precio = precio
        self.stock = stock

    #Si hay mas tablas para crear las definimos aca

with app.app_context():
    db.create_all() #Crea las tablas

class ArticulosSchema(ma.Schema):
    class Meta:
        fields=('id_articulo','rubro','descripcion','precio','stock')
    
articulo_schema=ArticulosSchema() #El objeto para traer un producto
articulos_schema=ArticulosSchema(many=True) #Trae muchos registro de producto



#Creamos los endpoint
#GET
#POST
#Delete
#Put

#Get endpoint del get
@app.route('/store',methods=['GET'])
def get_Articulos():
    all_articulos = Articulos.query.all() #heredamos del db.model
    result= articulos_schema.dump(all_articulos) #lo heredamos de ma.schema
                                                #Trae todos los registros de la tabla y los retornamos en un JSON
    return jsonify(result)

@app.route('/store/<txtsearch>',methods=['GET'])
def get_articulo(id):
    articulo=Articulos.query.filter(descripcion == 17011)
    return articulo_schema.jsonify(articulo)   # retorna el JSON de un producto recibido como parametro

@app.route('/store', methods=['POST']) # crea ruta o endpoint
def create_user():
    #print(request.json)  # request.json contiene el json que envio el cliente
    id_articulo=request.json['id_articulo']
    rubro=request.json['rubro']
    descripcion=request.json['descripcion']
    precio=request.json['precio']
    stock=request.json['stock']
    new_articulo=Articulo(id_articulo,rubro,descripcion,precio,stock)
    db.session.add(new_articulo)
    db.session.commit()
    return articulo_schema.jsonify(new_articulo)


#Programa Principal
if __name__ == '__main__':
    app.run(debug=True, port=5000)

