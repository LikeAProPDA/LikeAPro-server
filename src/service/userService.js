import { ApplicationError } from '../util/error/applicationError.js';

const isEmail = (email) => {
    if (email === null || email === undefined) {
        return false;
    }

    return true;
};

const signUp = async (email, nickname, password, backjoonId) => {
    if (!isEmail(email)) {
        throw new ApplicationError(400, 'is not valid email');
    }

    return true;
};

export { signUp };
