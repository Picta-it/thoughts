# Model structure

Model correspond to data entities. Those data are at a logic state. They do not represent raw stored data nor domain data.

This data encapsulate physical linked data.

## Example

Here is an example of user model instance. 

```javascript
UserModel = {
  'firstName' : 'John',
  'lastName'  : 'Doe',
  'address'   : {
    'id'        : 1,
    'street'    : '1 rue imaginaire',
    'zipCode'   : '10000',
    'city'      : 'Paris',
    'country'   : {
      'id'          : 1,
      'name'        : 'France'
    }
  }
}
```

We need to be sure that every instance of a model follow a schema. Because we are doing Javascript, model will always be in a Javascript Object format. So, the best, the easiest and most common format is JSON.

To describe those JSON schema we will use [JSON schema](http://json-schema.org/
).

Here is the schema describing the UserModel.

```json
{
    'title': 'Example Schema',
    'type': 'object',
    'properties': {
        'firstName': {
            'type': 'string'
        },
        'lastName': {
            'type': 'string'
        },
        'address': {
          '$ref': '#/definitions/address'
        }
        'age': {
            'description': 'Age in years',
            'type': 'integer',
            'minimum': 0
        }
    },
    'required': ['firstName', 'lastName']
}
```

This schema refers to `address` schema. We won't describe it here.

## Needs

The aim is to have our models validated over schemas. This implementation must be common to every model.

So we will have something like that :

```javascript
// New user instanciation.
// It throws if the user does not respect the user schema.
var user = new User({
  // User data
});
```

To build new models easily we will use the builder pattern. So we'll need the director, the builder, the concrete builder and the product.

## Builder design pattern

### Product

Here the product will correspond to our model. What we want to be returned is a built model class.

```javascript
var _name      = new WeakMap(),
    _schema    = new WeakMap(),
    _validator = new WeakMap();

class BuiltModel {
  constructor(data) {
    var validator  = _validator.get(this),
        validation = validator.validate(data);
    
    if(!validation.isValid) {
      throw(new Error('The data is not valid for ' + _name.get(this)));
    }
    _.merge(this, data);

    return this;
  }
}

class Model {
  $setValidator(validator) {
    _validator.set(this, validator);

    return this;
  }
  $setSchema(schema) {
    _schema.set(this, schema);

    return this;
  }
  $setName(name) {
    _name.set(this, name);

    return this;
  }
  $getValidator() {
    return _validator.get(this);
  }
  $getSchema() {
    return _schema.get(this);
  }
  $getName() {
    return _name.get(this);
  }
  $getModel() {
    return BuiltModel.bind(this);
  }
}

export { Model };
```

### Builder

Then the builder abstraction define the builder class signature to generate model.

```javascript
var _model      = new WeakMap();

class ModelBuilder {
  createNewModel() {
    _model.set(this, new Model());

    return this;
  }
  getModel() {
    return _model.get(this).$getModel();
  }
  setValidator() {
    throw(new Error('You must define setValidator()'));
  }
  setSchema() {
    throw(new Error('You must define setSchema()'));
  }
  setName() {
    throw(new Error('You must define setName()'));
  }
}

export { ModelBuilder };
```

### Builder concrete

The builder implementation is then defined in the concrete builder.

```javascript
class ModelConcreteBuilder extends ModelBuilder {
  'model' : undefined, // Model to be built
  setValidator(validator) {
    this.model.$setValidator(validator);

    return this;
  }
  setSchema(schema) {
    this.model.$setSchema(schema)
  };
  setName(name) {
    this.model.$setName(name);
  }
}

export { ModelConcreteBuilder };
```

### Director

Now, each model class can be created easily. Those models are independant from the global model implementation. They depend to each project they will be used for.

```javascript
import ModelConcreteBuilder as Model from 'ModelConcreteBuilder';

var User = new Model.createNewModel();

User.setName(/* Name */)
    .setValidator(/* Validator Function */)
    .setSchema(/* Schema Object */);

export { User.getModel() as User };
```

### Client

And finally, the model can be used.

```javascript
import User from 'User';

var user1 = new User({
  /* Some user */
});
```

### Validator

To work, the validator must contain `validate` as function. It validates the data data schema. Then, it returns `isValid` and `validations`.

The first return a Boolean describing if the data isValid or not. If any of the data validated is wrong the result is false.

The second describe the validation result more explicitly. Each cell of the array correspond to the data validated.

