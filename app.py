from flask import Flask,jsonify,request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from datetime import datetime

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
#Base de datos de articulos
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
#Base de datos de los pedidos de los clientes
class Pedidos(db.Model):
    id_pedido=db.Column(db.Integer, primary_key=True)
    cod_cli=db.Column(db.Integer)
    fecha=db.Column(db.String(19))
    estado=db.Column(db.String(1))
    def __init__(self,cod_cli,fecha,estado):
        self.cod_cli = cod_cli
        self.fecha = fecha
        self.estado = estado
#Base de datos del detalle del pedido de los clientes
class DetPedidos(db.Model):
    id_pedido = db.Column(db.Integer, primary_key=True)
    cod_art = db.Column(db.Integer)
    descripcion = db.Column(db.String(40))
    cantp = db.Column(db.Integer)
    precio = db.Column(db.Integer)
    def __init__(self,id_pedido,cod_art,descripcion,cantp,precio):
        self.id_pedido = id_pedido
        self.cod_art = cod_art
        self.descripcion = descripcion
        self.cantp = cantp
        self.precio = precio

with app.app_context():
    db.create_all() #Crea las tablas

class ArticulosSchema(ma.Schema):
    class Meta:
        fields=('id_articulo','rubro','descripcion','precio','stock')
    
articulo_schema=ArticulosSchema()
articulos_schema=ArticulosSchema(many=True)

class PedidosSchema(ma.Schema):
    class Meta:
        fields=('id_pedido','cod_cli','fecha','estado')
    
pedido_schema=PedidosSchema()
pedidos_schema=PedidosSchema(many=True)

class DetPedidosSchema(ma.Schema):
    class Meta:
        fields=('id_pedido','cod_art','descripcion','cantp','precio')
    
detpedido_schema=DetPedidosSchema()
detpedidos_schema=DetPedidosSchema(many=True)

#--------------------------------------------------------------------------------------#
#                                    Endpoints
#--------------------------------------------------------------------------------------#

#Trae todos los articulos
@app.route('/store',methods=['GET'])
def get_Articulos():
    all_articulos = Articulos.query.all() #heredamos del db.model
    result= articulos_schema.dump(all_articulos) #lo heredamos de ma.schema
                                                #Trae todos los registros de la tabla y los retornamos en un JSON
    return jsonify(result)

#Realiza la busqueda inteligente
@app.route('/store/<txtsearch>',methods=['GET'])
def get_articulo(txtsearch):
    all_articulos = Articulos.query.filter(Articulos.descripcion.ilike(f'%{txtsearch}%') | Articulos.rubro.ilike(f'%{txtsearch}%') | Articulos.id_articulo.ilike(f'%{txtsearch}%')).all()
    result= articulos_schema.dump(all_articulos) #lo heredamos de ma.schema
                                                #Trae todos los registros de la tabla y los retornamos en un JSON
    return jsonify(result)

# Crea un pedido nuevo
@app.route('/store', methods=['POST']) 
def create_pedido():
    cod_cli=request.json['cod_cli']
    fecha=request.json['fecha']
    estado=request.json['estado']  
    new_pedido=Pedidos(cod_cli,fecha,estado)
    db.session.add(new_pedido)
    db.session.commit()
    return pedido_schema.jsonify(new_pedido)

#Programa Principal
if __name__ == '__main__':
    app.run(debug=True, port=5000)

