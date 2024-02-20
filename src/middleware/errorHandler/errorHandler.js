const errorHandler = (err, req, res) => {
    if (err instanceof ApplicationError) {
        return res.status(err.status).json({
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
