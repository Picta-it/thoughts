# Data connection structure

This document aim is to define a clean design pattern for data representation.
The aim is to split the domain access in distinct layers.

This way, domain logic is separated from data access. And data is persisted to ease it's use on the domain layer.

For this purpose, we will separate the data structure in 4 layers :

- persistence : Data persistence (repositoyr pattern)
- mapper : Separation between software in-memory data and the database (datamapper pattern)
- model : Data instanciation (factory pattern)
- datasource : Data-source connection

domain -> **repository -> data mapper(model) -> datasource** -> database

The repository contains the data persistence used by the domain layer. It accesses data through the data mapper and instanciate data with the model. 
The datamapper accesses the database following the datasource interface.

## Repository

The repository correspond to data persistence logic. It connects domain side to physical data. It also instanciate data following a model to ease domain pattern job.

It is agnostic of the datasource. And use the model and the mapper following their interfaces.

```javascript
Users = {
  add : function(User, callback) {},
  remove : function(User, callback) {},
  findAll : function(callback) {},
  update : function(user, updatedUser, callback, partial)
}
```

## Model

Model correspond to data entities. Those data are at a logic state. It does not represent raw stored data nor domain data. This data encapsulate physical linked data.

```javascript
User = {
  "id" : ObjectId,
  "name": "test",
  "age" : 18,
  "company" : {
    "name": "pbx",
    "address" : "..."
  },
  "getId": function(){},
  "getName": function(){}
}
```

## Mapper

Its responsability is to map data to the database using a datasource. It allow to persist and retrieve data.

```javascript
userMapper.persist(User);
userMapper.persist(id);
```

## Datasource

The datasource corresponds to the data connections. It gives access to physical data.
It is the only part that know about database actions such as SQL or NoSQL or the driver used to access data.

```javascript
mongoDS.create('User', User);
mongoDS.read('User', 1);
mongoDS.update('User', User);
mongoDS.delete('User', User);
```
