import PlayGroundModel from '../db/models/playgroundModel.js';
import { ApplicationError } from '../util/error/applicationError.js';

const postPlayground = async (userId, code, title, description) => {
    if (await isExistByTitle(title)) {
        throw new ApplicationError(400, '중복된 제목');
    }

    const playground = await new PlayGroundModel({
        user: userId,
        code: code,
        title: title,
        description: description,
    });

    await playground.save();

    // UPLOADED 올린 상태, ACCEPTED 승인 상태 // REJECTED 거절 상태

    return {
        id: playground._id,
        status: playground.status,
    };
};

const getPlaygroundById = async (id) => {
    try {
        const playground = await PlayGroundModel.findById(id);

        if (playground.status !== 'ACCEPTED') {
            throw new ApplicationError(403, '해당 플레이그라운드를 볼 수 없음');
        }

        return {
            id: playground._id,
            title: playground.title,
            status: playground.status,
            createdAt: playground.createdAt,
            description: playground.description,
            code: playground.code,
            user: {
                id: playground.user._id,
                nickname: playground.user.nickname,
            },
        };
    } catch (err) {
        console.error(err);
        throw new ApplicationError(400, '해당 id의 플레이그라운드가 없음');
    }
};

const getAllPlayground = async () => {
    const playgrounds = await PlayGroundModel.find({}).populate('user');

    return playgrounds.map((p) => ({
        id: p._id,
        title: p.title,
        status: p.status,
        createdAt: p.createdAt,
        description: p.description,
        user: {
            id: p.user._id,
            nickname: p.user.nickname,
        },
    }));
};

const isExistByTitle = async (title) => {
    const result = await PlayGroundModel.exists({ title: title });

    return result;
};

export { postPlayground, getAllPlayground, getPlaygroundById };
