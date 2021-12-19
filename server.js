const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

// protoc
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObj.todoPackage;

// Data
const todos = [];

// RPC
function createTodo(call, callback) {
    console.log(call);

    const todoItem = {
        "id": todos.length + 1,
        "title": call.request.title,
        "text": call.request.text
    };
    todos.push(todoItem);

    callback(null, todoItem);
}

function readTodos(call, callback) {
    console.log(call);

    callback(null, {"todoItems": todos});
}

function readTodoStream(call, callback) {
    console.log(call);

    todos.forEach(t => call.write(t));
    
    call.end();
}

// Server
const server = new grpc.Server();
server.bindAsync(
    '0.0.0.0:40000', 
    grpc.ServerCredentials.createInsecure(),  // HTTP2 needs credentials by default.
    () => {
        server.start();
        console.log('Server started on port 40000');
    }
);
server.addService(todoPackage.Todo.service, {
    "createTodo": createTodo,
    "readTodos": readTodos,
    "readTodoStream": readTodoStream
});

