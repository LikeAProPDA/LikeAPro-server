import { ApplicationError } from '../../util/error/applicationError.js';

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApplicationError) {
        res.status(err.status).json({
            success: false,
            message: err.message,
        });
    }

    res.status(500).json({
        success: false,
        message: "Can't Handling Error",
    });
};

export default errorHandler;
