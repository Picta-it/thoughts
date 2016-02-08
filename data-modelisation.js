// Instanciate the data formatter
var model = new PiModel({/*...*/});

// Instanciate the data access
var dataSource = new PiDataSource(/*...*/);

// Instanciate the data mapping
var dataMapper = new PiDataMapper(dataSource);

// Instanciate the data builder
// var factory = new PiFactory(/*...*/);

// Instanciate the data persistence 
var repository = new PiDataPersistence(dataMapper, model);


// Example

// Factory
// file://<PROJECT>/lib/Model/User.js
var User = new PiModel({
  'name' : 'User',
  'description' : 'Some user thing',
  'schema' : new PiValidatorTV4() //::PiValidator
});

// file://<PROJECT>/lib/DataSource/MongoDataSource.js
var mongoDS = new PiMongoDataSource({ //::PiDataSource
  'url' : 'localhost',
  'database' : 'randomName'
});
/*
  class PiMongoDataSource extends PiDataSource {
    constructor(options) {
    }

    create() {
      if(exists(data)) {
        this._create(data);
      }
    }

    read() {
      if(exists(data)) {
        this._create(data);
      }
    }

    update() {
  
    }

    delete() {
  
    }
  }
*/

// Data gateway
// file://<PROJECT>/lib/Mapper/UserMapper.js
var userMapper = new UserDataMapper(mongoDS, User); //::PiDataMapper
/*
  class UserMapper extends PiDataMapper {
    constructor(piDataSource, Model) {
      this.model = piDataSource;
      this.datasource = piDataSource;
    }

    persist(data) {
      if(Model.isValid(data)) {
        this.datasource.set(Model.name, data);
      }
    }

    retrieve(id) {
      return this.datasource.get(Model.name, id);
    }
  }
*/

// Repository
// file://<PROJECT>/lib/Persistence/Users.js
var Users = new UsersPersistence(userMapper); //::PiDataPersistence
/*
  class UsersPersistence extends PiDataPersistence {
    constructor(piDataMapper) {
      this.mapper = piDataMapper;
    }

    add(data) {
      return this.mapper.persist(data.getRaw());
    }

    findById(id) {
      return User(this.mapper.retrieve(id));
    }
  }
*/

var user = new User({
  'firstname' : 'John',
  'lastname' : 'Smith'
});

// Signatures
// Create
Users.add(user, callback(error, user));
Users.add(users, callback(error, users));

// Read
Users.findAll(callback(error, users));
Users.findById(id, callback(error, user));
Users.findByRequest(request, callback(error, users));

// Update
Users.updateByRequest(request, otherUser, callback(error, oldUser, newUser), partial = true);
Users.update(user, otherUser, callback(error, oldUser, newUser), partial = true);
Users.updateById(id, otherUser, callback(error, oldUser, newUser), partial = true);

// Delete
Users.removeAll(callback(error, users));
Users.removeById(id, callback(error, user));
Users.remove(user, callback(error, user));


