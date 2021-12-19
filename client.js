const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

// protoc
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObj.todoPackage;

const client = new todoPackage.Todo('localhost:40000', grpc.credentials.createInsecure());

const title = process.argv[2];
const text = process.argv[3];

client.createTodo({
    "id": -1,
    "title": title,
    "text": text
}, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('createTodo | response from server: ' + JSON.stringify(res));
    }
});

client.readTodos({}, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('readTodos | response from server: ' + JSON.stringify(res));
    }
});

const call = client.readTodoStream();
call.on('data', item => {
    console.log('readTodoStream | received item from server: ' + JSON.stringify(item));
});
call.on('end', e => {
    console.log('readTodoStream | received end from server: ' + e);
});
