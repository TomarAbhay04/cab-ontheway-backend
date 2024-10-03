// middleware/socket.js
export const socketMiddleware = (io) => {
    return (req, res, next) => {
      req.io = io; // Attach the io instance to the request object
      next();
    };
  };
  