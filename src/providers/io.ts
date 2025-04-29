// import { Server } from 'socket.io'
// import http from 'http'
// import { verifySocketToken } from '../middleware/Auth';
// import { adminEventHandler, adminChatHistoryListener } from '../sockets/handlers/admin.socket.handlers';
// import { sellerEventHandler, sellerChatHistoryListener } from '../sockets/handlers/seller.socket.handler';
// import { customerEventHandler } from '../sockets/handlers/customer.socket.handler';

// export const ioConnection = async (server: http.Server) => {

//     const io = new Server(server, {
//         serveClient: true,
//         cors: {
//             origin: true,
//             credentials: true,
//         },
//         allowEIO3: true,
//         pingTimeout: 7200000,
//         pingInterval: 25000
//     });

//     io.use(async (socket, next) => {
//         if (
//             socket.handshake.query.token &&
//             typeof socket.handshake.query.token === "string"
//         ) {
    
//             const { error, decoded } = await verifySocketToken(
//                 socket.handshake.query.token
//             );

//             if (decoded) {
//                 socket.handshake.auth.decoded = decoded;
//                 next();
//             } else {
//                 return next(new Error("Authentication Error"));
//             }
//         } else {
//             return next(new Error("Authentication Error"));
//         }
//     }).on('connection', (socket:any) => {
//         socket.join(socket.handshake.auth.decoded.id);
        
//         // Load the chat history
//         switch(socket.handshake.auth.decoded.role){
//             case "ADMIN":
//                 adminChatHistoryListener(socket, io);
//                 break;
//             case "SUPER_ADMIN":
//                 adminChatHistoryListener(socket, io);
//                 break;
//             case "AGENT":
//                 adminChatHistoryListener(socket, io);
//                 break;
//             case "SELLER":
//                 sellerChatHistoryListener(socket, io);
//                 break;
//             case "CUSTOMER":
//                 sellerChatHistoryListener(socket, io);
//                 break;
//             default:
//                 break;
//         }

//         socket.onAny((arg:any, data:any)=>{

//             switch(socket.handshake.auth.decoded.role){
//                 case "ADMIN":
//                     adminEventHandler(arg, data, socket, io);
//                     break;
//                 case "SUPER_ADMIN":
//                     adminEventHandler(arg, data, socket, io);
//                     break;
//                 case "AGENT":
//                     adminEventHandler(arg, data, socket, io);
//                     break;
//                 case "SELLER":
//                     sellerEventHandler(arg, data, socket, io);
//                     break;
//                 case "CUSTOMER":
//                     customerEventHandler(arg, data, socket, io);
//                     break;
//                 default:
//                     break;
//             }
//         })

//         socket.on('disconnect', () => {
//             console.log('User disconnected');
//         });
//     });
// }
