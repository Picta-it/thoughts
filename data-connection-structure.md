# Data connection structure

This document aim is to define a clean design pattern for data representation.
The aim is to split the code in domain domains specific logics.

Like that, domain logic will be distinct of data access. And data access would not be merged with data mapping.

For this, we will separate the data structure in 4 layers :

- repository : domain logic
- data mapper : data relationship
- model : data encapsulation
- datasource : data connection

repository -> data mapper(model) -> datasource

The repository contains the domain logic. It accesses the data mapper that contains the relationships. It split the models in database entities depending on their relationships. Then store it into the database through datasources. 

## Repository

The repository correspond to domain specific logic.
It connects domain side to the dataMapper and so physically distinct data are mapped together for business.

It is agnostic of the datasource or data mapping.

```javascript
form = {
  saveForm : function(rawDomainForm) {},
  getNationality : function() {},
  triggerDistinctAction : function() {}
}
```

rawDomainForm may contain data such as User, Roles, etc.
getNationality would give back user nationality.
triggerDistinctAction would trigger a totally distinct action.

## Model

Model correspond to data entities. Those data are at a logic state. They do not represent raw stored data nor domain data.
This data encapsulate physical linked data.

```javascript
User = {
  "id" : ObjectId,
  "name": "test",
  "age" : 18,
  "company" : {
    "name": "pbx",
    "address" : "..."
  }
}

```

## Data mapper

Its responsability is to map model and datasources.

```javascript
users = Users.create(User)
users = Users.read()
users = Users.update(User, User_updates)
users = Users.delete(User)
```

It is also responsible to map the raw data :

```javascript
User = {
  "id" : ObjectId,
  "name": "test",
  "age" : 18,
  "company" : {
    "name": "pbx",
    "address" : "..."
  }
}
```

To a split database format :

```javascript
User = {
  "id" : ObjectId,
  "name": "test",
  "age" : 18,
  "company" : ObjectId(2)
}

Company = {
  "id" : ObjectId(2),
  "name": "pbx",
  "address" : "..."
}
```

## Datasource

Datasources correspond to data connections. They give a way to access and store data.
It is the only part that know about database actions.

This way, we will have tables/collections accesses such as create/read/update/delete on a collection.
It maps the data to datasource specific format.

Eg. Object to SQL queries

