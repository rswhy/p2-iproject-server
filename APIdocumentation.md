# Endpoints

List of Available Endpoints:

- `POST /register`
- `POST /login`
- `POST /contactUs`
- `GET /users`
- `PATCH /users`
- `POST /payment`
- `GET /food`
- `POST /food`
- `DELETE /food`
- `DELETE /food/:foodId`

#

## POST /register

**Description**

- Create a new user

**Request**

- Headers

```json
{
  "Content-Type": "application/x-www-form-urlencoded"
}
```

- Body

```json
  {
    "name": String,
    "membership": String,
    "age": Integer,
    "weight": Integer,
    "dailyCalories": Integer,
    "caloriesIntake": Integer,
    "location": String,
    "status": String,
  }
```

**Response**

_201 - Created_

- Body:

```json
{
  "statusCode": 201,
  "message": "User created successfully",
  "data" : {
    "name": String,
    "membership": String,
    "age": Integer,
    "weight": Integer,
    "dailyCalories": Integer,
    "caloriesIntake": Integer,
    "location": String,
    "status": String,
  }
}
```

_400 - Bad Request_

- Body:

```json
{
  "statusCode": 400,
  "error" : {
    "message": [
      String,
      ...
    ]
  }
}
```

## POST /login

**Description**

- Login user

**Request**

- Headers

```json
{
  "Content-Type": "application/x-www-form-urlencoded"
}
```

- Body

```json
  {
    "email": String,
    "password": String,
  }
```

**Response**

_200 - OK_

- Body:

```json
{
  "statusCode": Integer,
  "access_token" : String
}
```

_401 - Unauthorized_

- Body:

```json
{
  "statusCode": Integer,
  "error": {
    "message": "Invalid email or password"
  }
}
```

## POST /contactUs

**Description**

- Send email to user

Body:

```json
{

  "emailUser": String,
  "subject": String,
  "message": Text,


}
```

**Response**

_200 - OK_

Body:

```json
{

  "emailUser": String,
  "subject": String,
  "message": Text,


}
```

## PATCH /users

**Description**

- Update membership

**Request**

- Headers

```json
  {
    "access_token": String
  }
```

**Response**

_200 - OK_

Body:

```json
{
  "statusCode": Integer,
  "data" :
    {
      "id": Integer,
      "name": String,
      "membership": String,
      "age": Integer,
      "weight": Integer,
      "dailyCalories": Integer,
      "caloriesIntake": Integer,
      "location": String,
      "status": String,
    },
}
```

_401 - Unauthorized_

- Body:

```json
{
  "statusCode": Integer,
  "error": {
    "message": "Invalid Token, please login first"
  }
}
```

## POST /payment

**Description**

- Pay for membership

**Request**

- Headers

```json
  {
    "access_token": String
  }
```

**Response**

_200 - OK_

Body:

```json
{
  "token": String,
  "redirect_url" : SrStringing
}
```

_401 - Unauthorized_

- Body:

```json
{
  "statusCode": Integer,
  "error": {
    "message": "Invalid Token, please login first"
  }
}
```

## GET /food

**Description**

- get user's all Food

**Request**

- Headers

```json
  {
    "access_token": String
  }

```

**Response**

_200 - OK_

- Body:

```json
{
  "statusCode": 200,
  "user" : {
    "id": Integer,
    "membership": String,
    },
  "data": [ {
      "id": Integer,
      "title":String,
      "calories":Integer
    },
    ...
  ]
}
```

_401 - Unauthorized_

- Body:

```json
{
  "statusCode": Integer,
  "error": {
    "message": "Invalid Token, please login first"
  }
}
```

## POST /food

**Description**

- Add food for user

**Request**

- Headers

````json
  {
    "access_token": String
  }

- Body
```json
  {
    "title": String,
    "seriesNumber": Integer,
    "image": String,
    "calories": String
  }
````

**Response**

_200 - OK_

- Body:

```json
{
  "statusCode": Integer,
  "message":  "Food added successfully",
  "data" : {
   "title": String,
    "seriesNumber": Integer,
    "image": String,
    "calories": String
  }

}
```

_404 - Not Found_

- Body:

```json
{
  "statusCode": Integer,
  "error": {
    "message": "Food Not Found"
  }
}
```

_401 - Unauthorized_

- Body:

```json
{
  "statusCode": Integer,
  "error": {
    "message": "Invalid Token, please login first"
  }
}
```

## DELETE /food

**Description**

- Delete/resrt all food from My Food

**Request**

- Headers

```json
  {
    "access_token": String
  }
```

**Response**

_200 - OK_

- Body:

```json
{
   "statusCode": Integer,
    "message": "Daily Food reset successfully",
}
```

_404 - Not Found_

- Body:

```json
{
  "statusCode": Integer,
  "error": {
    "message": "Post Not Found"
  }
}
```

_401 - Unauthorized_

- Body:

```json
{
  "statusCode": Integer,
  "error": {
    "message": "Invalid Token, please login first"
  }
}
```

## DELETE /food/:foodId

**Description**

- Delete a Food from User's My Food

**Request**

- Headers

```json
  {
    "access_token": String
  }
```

**Response**

_200 - OK_

- Body:

```json
{
   "statusCode": Integer,
   "message": "Food deleted successfully",
}
```

_404 - Not Found_

- Body:

```json
{
  "statusCode": 404,
  "error": {
    "message": "Post Not Found"
  }
}
```

_401 - Unauthorized_

- Body:

```json
{
  "statusCode": 401,
  "error": {
    "message": "Invalid Token, please login first"
  }
}
```

## Global Error

**Response**

_500 - Internal Server Error_

- Body:

```json
{
  "statusCode": 500,
  "error": {
    "message": "Internal Server Error"
  }
}
```
